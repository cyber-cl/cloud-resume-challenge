# =============================================================================
# Lambda — Visitor Counter Function
# =============================================================================

# Package the Lambda function code
data "archive_file" "visitor_counter" {
  type        = "zip"
  source_file = "${path.module}/lambda/visitor_counter.py"
  output_path = "${path.module}/lambda/visitor_counter.zip"
}

# Lambda function
resource "aws_lambda_function" "visitor_counter" {
  function_name    = var.lambda_function_name
  description      = "Cloud Resume Challenge — Visitor counter with IP-based daily dedup"
  filename         = data.archive_file.visitor_counter.output_path
  source_code_hash = data.archive_file.visitor_counter.output_base64sha256
  handler          = "visitor_counter.lambda_handler"
  runtime          = "python3.12"
  timeout          = 10
  memory_size      = 128

  role = aws_iam_role.lambda_execution.arn

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.visitors.name
    }
  }

  tags = {
    Name = "Cloud Resume Visitor Counter"
  }
}

# Lambda Function URL — public HTTP endpoint (replaces API Gateway)
resource "aws_lambda_function_url" "visitor_counter" {
  function_name      = aws_lambda_function.visitor_counter.function_name
  authorization_type = "NONE" # Public access

  cors {
    allow_origins     = ["https://${var.domain_name}", "https://www.${var.domain_name}"]
    allow_methods     = ["GET"]
    allow_headers     = ["Content-Type", "Accept"]
    expose_headers    = ["Content-Type"]
    max_age           = 86400
    allow_credentials = false
  }
}

# CloudWatch Log Group for Lambda (with retention)
resource "aws_cloudwatch_log_group" "visitor_counter" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14

  tags = {
    Name = "Cloud Resume Lambda Logs"
  }
}
