# =============================================================================
# IAM — Roles & Policies
# =============================================================================

# ---- Data Sources ----

data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

# =============================================================================
# Lambda Execution Role
# =============================================================================

resource "aws_iam_role" "lambda_execution" {
  name = "${var.lambda_function_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "Lambda Execution Role — Visitor Counter"
  }
}

# DynamoDB access policy for Lambda
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "dynamodb-visitor-counter-access"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = aws_dynamodb_table.visitors.arn
      }
    ]
  })
}

# CloudWatch Logs policy for Lambda
resource "aws_iam_role_policy" "lambda_logging" {
  name = "cloudwatch-logs-access"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.visitor_counter.arn}:*"
      }
    ]
  })
}

# =============================================================================
# GitHub Actions OIDC Provider (conditional)
# =============================================================================

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 1 : 0

  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    Name = "GitHub Actions OIDC Provider"
  }
}

# =============================================================================
# GitHub Actions IAM Role (for CI/CD deployment)
# =============================================================================

locals {
  oidc_provider_arn = var.create_github_oidc_provider ? (
    aws_iam_openid_connect_provider.github[0].arn
    ) : (
    "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
  )
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions-cloud-resume-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:*"
          }
        }
      }
    ]
  })

  tags = {
    Name = "GitHub Actions Deploy Role — Cloud Resume"
  }
}

# S3 deployment policy for GitHub Actions
resource "aws_iam_role_policy" "github_actions_s3" {
  name = "s3-deploy-access"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3SyncAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.website.arn,
          "${aws_s3_bucket.website.arn}/*"
        ]
      }
    ]
  })
}

# CloudFront invalidation policy for GitHub Actions
resource "aws_iam_role_policy" "github_actions_cloudfront" {
  name = "cloudfront-invalidation-access"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontInvalidation"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = aws_cloudfront_distribution.website.arn
      }
    ]
  })
}
