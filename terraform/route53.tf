# =============================================================================
# Route 53 — DNS
# =============================================================================

resource "aws_route53_zone" "primary" {
  name    = var.domain_name
  comment = "Hosted zone for ${var.domain_name} — Cloud Resume Challenge"

  tags = {
    Name = "Cloud Resume DNS Zone"
  }
}

# A record — root domain → CloudFront
resource "aws_route53_record" "root_a" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record — root domain → CloudFront (IPv6)
resource "aws_route53_record" "root_aaaa" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# A record — www subdomain → CloudFront
resource "aws_route53_record" "www_a" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record — www subdomain → CloudFront (IPv6)
resource "aws_route53_record" "www_aaaa" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}
