# =============================================================================
# Outputs — Cloud Resume Challenge
# =============================================================================

# ---- S3 ----

output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the static website"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

# ---- CloudFront ----

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (use in GitHub Actions for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

# ---- Route 53 ----

output "route53_nameservers" {
  description = "Route 53 nameservers — point your domain registrar to these"
  value       = aws_route53_zone.primary.name_servers
}

output "website_url" {
  description = "Live website URL"
  value       = "https://${var.domain_name}"
}

# ---- Lambda ----

output "lambda_function_url" {
  description = "Lambda Function URL for the visitor counter API"
  value       = aws_lambda_function_url.visitor_counter.function_url
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.visitor_counter.function_name
}

# ---- DynamoDB ----

output "dynamodb_table_name" {
  description = "DynamoDB table name for the visitor counter"
  value       = aws_dynamodb_table.visitors.name
}

# ---- GitHub Actions ----

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions — set as AWS_ROLE_ARN secret in your repo"
  value       = aws_iam_role.github_actions.arn
}
