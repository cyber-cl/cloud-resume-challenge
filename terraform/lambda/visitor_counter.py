import json
import boto3
import time
import os

# Initialize DynamoDB resource
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("DYNAMODB_TABLE", "cloudresume-visitors"))


def lambda_handler(event, context):
    """
    Visitor counter Lambda function.

    Counts unique visitors per day based on IP address.
    One IP address is counted only once per 24 hours.

    Expected to be invoked via Lambda Function URL.
    """
    request_context = event.get("requestContext", {})
    http_context = request_context.get("http", {})
    source_ip = http_context.get("sourceIp") or "unknown"
    ip_key = f"ip:{source_ip}"

    existing = table.get_item(Key={"id": ip_key})
    now = int(time.time())

    if "Item" in existing:
        item = existing["Item"]
        last_seen = item.get("last_seen", 0)

        # If visited within the last 24 hours, return current count without incrementing
        if now - last_seen < 24 * 60 * 60:
            counter_item = table.get_item(Key={"id": "counter"})
            count = int(counter_item.get("Item", {}).get("count", 0))

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                "body": json.dumps({"count": count}),
            }

    # Record/update this IP's visit timestamp + set TTL for auto-cleanup (48 hours)
    table.put_item(
        Item={
            "id": ip_key,
            "last_seen": now,
            "ttl": now + (48 * 60 * 60),
        }
    )

    # Atomically increment the counter
    response = table.update_item(
        Key={"id": "counter"},
        UpdateExpression="SET #c = if_not_exists(#c, :zero) + :inc",
        ExpressionAttributeNames={"#c": "count"},
        ExpressionAttributeValues={":zero": 0, ":inc": 1},
        ReturnValues="UPDATED_NEW",
    )

    count = int(response["Attributes"]["count"])

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({"count": count}),
    }
