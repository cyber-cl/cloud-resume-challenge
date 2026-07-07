# =============================================================================
# Variables — Cloud Resume Challenge
# =============================================================================

variable "aws_region" {
  description = "Primary AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Root domain name (e.g. prasantjakhar.xyz)"
  type        = string
  default     = "prasantjakhar.xyz"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for the static website. Must be globally unique."
  type        = string
  default     = "cloud-resume-challenge21"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for the visitor counter"
  type        = string
  default     = "cloudresume-visitors"
}

variable "lambda_function_name" {
  description = "Name of the visitor counter Lambda function"
  type        = string
  default     = "cloud-resume-visitor-counter"
}

variable "github_repo" {
  description = "GitHub repository in the format org/repo for OIDC trust"
  type        = string
  default     = "cyber-cl/cloud-resume-challenge"
}

variable "create_github_oidc_provider" {
  description = "Whether to create the GitHub OIDC provider. Set to false if one already exists in the account."
  type        = bool
  default     = true
}

variable "environment" {
  description = "Environment tag (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "common_tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default     = {}
}

# Computed locals that merge user tags with defaults
locals {
  tags = merge(
    {
      Project     = "cloud-resume-challenge"
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.common_tags
  )
}
