# =============================================================================
# CloudFront — CDN Distribution
# =============================================================================

# Origin Access Control for secure S3 access
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.s3_bucket_name}-oac"
  description                       = "OAC for Cloud Resume S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Cloud Resume Challenge — ${var.domain_name}"
  aliases             = [var.domain_name, "www.${var.domain_name}"]
  price_class         = "PriceClass_100" # US, Canada, Europe (cost-optimized)
  wait_for_deployment = false

  # S3 origin with OAC
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.s3_bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  # Default cache behavior
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    # Use managed cache policy: CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    # Use managed origin request policy: CORS-S3Origin
    origin_request_policy_id = "88a5eaf4-2f7a-4b3b-b694-103afeb494eb"
  }

  # Custom error response — return index.html for 403/404 (SPA-like behavior)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # SSL certificate
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.website.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Geo restrictions (none)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "Cloud Resume Distribution"
  }
}
