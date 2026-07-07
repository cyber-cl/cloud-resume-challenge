# =============================================================================
# DynamoDB — Visitor Counter Table
# =============================================================================

resource "aws_dynamodb_table" "visitors" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST" # On-demand, free tier friendly
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # TTL for IP tracking records — allows automatic cleanup of stale IP entries
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = false # Not needed for a simple counter
  }

  tags = {
    Name = "Cloud Resume Visitor Counter"
  }
}
