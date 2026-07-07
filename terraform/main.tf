# =============================================================================
# Terraform Configuration — Cloud Resume Challenge
# =============================================================================
#
# This Terraform configuration provisions the complete AWS infrastructure for
# the Cloud Resume Challenge portfolio website:
#
#   - S3 bucket for static website hosting
#   - CloudFront CDN with HTTPS
#   - ACM SSL certificate with DNS validation
#   - Route 53 DNS records
#   - DynamoDB table for visitor counter
#   - Lambda function with Function URL for visitor counter API
#   - IAM roles for Lambda execution and GitHub Actions CI/CD (OIDC)
#
# Usage:
#   1. Copy terraform.tfvars.example to terraform.tfvars and fill in values
#   2. terraform init
#   3. terraform plan
#   4. terraform apply
#
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  # -------------------------------------------------------------------------
  # Uncomment the block below to use an S3 remote backend for state storage.
  # Replace the bucket, key, region, and dynamodb_table with your own values.
  # -------------------------------------------------------------------------
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "cloud-resume-challenge/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "terraform-state-lock"
  #   encrypt        = true
  # }
}

# Primary provider — us-east-1 (also required for ACM + CloudFront)
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.tags
  }
}
