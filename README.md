# Cloud Resume Challenge Portfolio Website

A modern, interactive portfolio website built with HTML, CSS, and JavaScript, designed specifically for the Cloud Resume Challenge.

## Overview

This portfolio website is designed to showcase your skills, projects, and experience as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/). It features a clean, responsive design with interactive elements and a visitor counter that can be integrated with AWS services.

## Features

- **Responsive Design**: Looks great on all devices, from mobile phones to desktop computers
- **Interactive UI**: Smooth animations, transitions, and interactive elements
- **Project Showcase**: Filterable project cards to highlight your cloud projects
- **Enhanced Skills Section**: Visual representation of your technical skills with categories for Cloud Platforms, Programming Languages, Operating Systems, and DevOps Tools
- **Certifications Display**: Grid layout to showcase your professional certifications
- **Visitor Counter**: Integration with AWS Lambda and DynamoDB (as per Cloud Resume Challenge)
- **Contact Form**: Ready-to-use contact form (requires backend integration)
- **Modern Design**: Clean, professional look with customizable color scheme
- **Blog Section**: Showcase your technical writing and knowledge sharing

## Recent Updates

- **Skills Section Enhancement**: Added new categories for Programming Languages (Python, Java, Shell Scripting) and Operating Systems (Unix/Linux, Windows)
- **Interactive Elements**: Added hover effects and animations to skill categories and items
- **Progress Bar Animation**: Skills now feature animated progress bars that fill when scrolled into view
- **Visitor Counter**: Implemented a clean, minimalist design for the visitor counter with AWS Lambda & DynamoDB integration
- **Responsive Improvements**: Enhanced mobile responsiveness across all sections
- **Performance Optimization**: Improved loading times and animations

## Cloud Resume Challenge Integration

This website is specifically designed to work with the Cloud Resume Challenge, which involves:

1. Creating a static website hosted in an S3 bucket
2. Setting up HTTPS with CloudFront
3. Implementing a visitor counter with API Gateway, Lambda, and DynamoDB
4. Using Infrastructure as Code (IaC) for deployment

The visitor counter section is already set up in the HTML and JavaScript to work with your AWS Lambda function.

## How to Customize

### Personal Information

1. Edit the `index.html` file to update:
   - Your name and personal details
   - Skills and proficiency levels
   - Project descriptions and links
   - Contact information

### Styling

1. Modify the `styles.css` file to change:
   - Color scheme (update the root variables)
   - Fonts and typography
   - Layout and spacing

### Functionality

1. Update the `script.js` file to:
   - Connect the visitor counter to your actual AWS Lambda endpoint
   - Customize animations and interactions
   - Add additional JavaScript functionality

## Visitor Counter Implementation

To fully implement the visitor counter for the Cloud Resume Challenge:

1. Create a DynamoDB table to store the visitor count
2. Create a Lambda function to increment and retrieve the count
3. Set up API Gateway to expose your Lambda function
4. Update the `fetchVisitorCount()` function in `script.js` with your API endpoint

Example Lambda function (Python):

```python
import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

# Reference the specific DynamoDB table
table = dynamodb.Table('cloudresumechallenge-table')

def lambda_handler(event, context):
    # Use update_item with expression attribute names to avoid reserved keyword issue
    response = table.update_item(
        Key={'id': '1'},
        UpdateExpression='SET #v = #v + :inc',
        ExpressionAttributeNames={'#v': 'views'},  # Use #v to represent the reserved keyword 'views'
        ExpressionAttributeValues={':inc': 1},
        ReturnValues='UPDATED_NEW'
    )
    
    # Extract the updated view count
    updated_views = response['Attributes']['views']
    
    # Print the new count (for logging)
    print(updated_views)
    
    # Return the updated view count
    return updated_views
```

## Deployment

To deploy this website as part of the Cloud Resume Challenge:

1. Create an S3 bucket configured for static website hosting
2. Upload all files to the S3 bucket
3. Set up CloudFront distribution pointing to your S3 bucket
4. Configure a custom domain with Route 53 (optional)
5. Set up CI/CD pipeline for automated deployment (optional)

### Automated Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys changes to AWS S3 whenever you push to the main branch:

1. The workflow uses Jake Jarvis's S3 sync action to efficiently sync files to S3
2. It sets appropriate cache control headers for optimal performance
3. It creates a CloudFront invalidation to ensure changes are immediately visible

To set up the GitHub Actions workflow:

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key with S3 and CloudFront permissions
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID (if using CloudFront)

2. Push changes to the main branch to trigger the deployment

## Technologies Used

- HTML5
- CSS3 (with CSS variables, flexbox/grid layouts, and animations)
- JavaScript (ES6+, Intersection Observer API for scroll animations)
- Font Awesome for icons
- Responsive design techniques

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

Created as part of the Cloud Resume Challenge. Feel free to use and modify for your own portfolio!

# Cloud Resume Challenge - AWS Implementation

## Architecture Overview

```ascii
                                  +----------------+
                                  |                |
                                  |  GitHub Repo   |
                                  |                |
                                  +--------+-------+
                                           |
                                           | GitHub Actions
                                           v
                                  +----------------+
                                  |                |
                                  |  CI/CD Pipeline|
                                  |                |
                                  +--------+-------+
                                           |
                                           v
+----------------+            +----------------+            +----------------+
|                |            |                |            |                |
|  Route 53      +----------->+  CloudFront    +----------->+  S3 Bucket     |
|  DNS           |            |  CDN           |            |  Static Website|
|                |            |                |            |                |
+----------------+            +----------------+            +----------------+
                                                                    ^
                                                                    |
                                                                    | API Calls
                                                                    v
+----------------+            +----------------+            +----------------+
|                |            |                |            |                |
|  DynamoDB      +<-----------+  Lambda        +<-----------+  API Gateway   |
|  Database      |            |  Function      |            |                |
|                |            |                |            |                |
+----------------+            +----------------+            +----------------+
```

This project implements the [AWS Cloud Resume Challenge](https://cloudresumechallenge.dev/docs/the-challenge/aws/), a hands-on project designed to help you build and demonstrate your cloud skills. Below is a detailed comparison of each step from the official challenge and how I implemented it.

## Challenge Steps Implementation

### 1. Certification

**Official Requirement**: Obtain the AWS Cloud Practitioner certification.

**My Implementation**: Successfully obtained the AWS Certified Solutions Architect - Associate certification, which exceeds the minimum requirement of the Cloud Practitioner certification. This certification validates my ability to design and implement distributed systems on AWS.

### 2. HTML

**Official Requirement**: Create a resume in HTML format, not a Word doc or PDF.

**My Implementation**: Developed a responsive HTML resume from scratch, structured with semantic HTML5 elements for better accessibility and SEO. The HTML includes sections for:
- Professional summary
- Work experience
- Skills
- Certifications
- Projects
- Education
- Contact information

### 3. CSS

**Official Requirement**: Style the resume with CSS.

**My Implementation**: Created a custom CSS stylesheet with:
- Modern, responsive design using CSS Grid and Flexbox
- Custom color scheme with CSS variables for easy theming
- Animations and transitions for interactive elements
- Mobile-first approach with media queries for different screen sizes
- Smooth scrolling behavior for better user experience

### 4. Static Website

**Official Requirement**: Deploy the HTML resume as an Amazon S3 static website.

**My Implementation**: Set up an S3 bucket configured for static website hosting with:
- Proper bucket policies for public read access
- Organized file structure for HTML, CSS, JavaScript, and assets
- Configured index.html as the default document
- Set up error handling with a custom 404 page

### 5. HTTPS

**Official Requirement**: Use Amazon CloudFront to enable HTTPS for security.

**My Implementation**: Configured CloudFront distribution with:
- SSL/TLS certificate from AWS Certificate Manager
- HTTPS redirection from HTTP
- Optimized cache settings for different content types
- Custom error responses
- Origin access identity for secure S3 access

### 6. DNS

**Official Requirement**: Point a custom domain name to the CloudFront distribution.

**My Implementation**: Registered the domain `thedevopsproject.live` and configured Route 53 with:
- A record with Alias to CloudFront distribution
- Proper DNS propagation settings
- DNS health checks
- DNSSEC for additional security

### 7. JavaScript

**Official Requirement**: Include a visitor counter using JavaScript.

**My Implementation**: Implemented a visitor counter with:
- Asynchronous JavaScript to fetch and update the count
- Clean UI integration with the rest of the resume
- Loading state and error handling
- Local storage to prevent multiple counts from the same session
- Smooth animation for count updates

### 8. Database

**Official Requirement**: Use Amazon DynamoDB to store the visitor count.

**My Implementation**: Created a DynamoDB table with:
- On-demand capacity mode for cost optimization
- Single-item design pattern for the counter
- Proper IAM permissions
- TTL settings for any temporary data
- Consistent reads for accurate counting

### 9. API

**Official Requirement**: Create an API using API Gateway and Lambda to communicate with DynamoDB.

**My Implementation**: Built a serverless API with:
- RESTful API design with API Gateway
- CORS configuration for security
- Request validation
- API key for additional security
- Proper HTTP status codes and response handling

### 10. Python

**Official Requirement**: Write Lambda function code in Python using boto3.

**My Implementation**: Developed a Python Lambda function that:
- Uses boto3 to interact with DynamoDB
- Implements atomic counter updates
- Includes proper error handling and logging
- Optimizes for cold starts
- Uses environment variables for configuration

### 11. Tests

**Official Requirement**: Include tests for the Python code.

**My Implementation**: Created comprehensive tests with:
- Unit tests for the Lambda function using pytest
- Mocking of AWS services
- Integration tests for the API
- Test coverage reporting
- Automated test execution in the CI/CD pipeline

### 12. Infrastructure as Code

**Official Requirement**: Define AWS resources using SAM or Terraform.

**My Implementation**: Used AWS SAM to define and deploy the backend infrastructure:
- Defined all resources in a SAM template
- Parameterized the template for different environments
- Included proper resource policies
- Set up logging and monitoring
- Implemented best practices for security

### 13. Source Control

**Official Requirement**: Create a GitHub repository for the backend code.

**My Implementation**: Set up a GitHub repository with:
- Well-structured project organization
- Comprehensive .gitignore file
- Detailed README with setup instructions
- Branch protection rules
- Issue and PR templates

### 14. CI/CD (Back end)

**Official Requirement**: Set up GitHub Actions for the backend code.

**My Implementation**: Configured GitHub Actions workflow that:
- Runs Python tests on every push
- Packages and deploys the SAM application on successful tests
- Includes security scanning
- Notifies of build status
- Uses GitHub Secrets for AWS credentials

### 15. CI/CD (Front end)

**Official Requirement**: Set up GitHub Actions for the frontend code.

**My Implementation**: Created a GitHub Actions workflow for the frontend that:
- Automatically deploys website updates to S3
- Invalidates CloudFront cache
- Includes linting and validation
- Optimizes assets before deployment
- Uses minimal complexity for better maintainability

### 16. Blog Post

**Official Requirement**: Write a blog post about what you learned.

**My Implementation**: Published a detailed blog post that:
- Explains the architecture and design decisions
- Discusses challenges faced and solutions found
- Shares lessons learned about AWS services
- Provides tips for others attempting the challenge
- Includes future improvements I plan to make

## Lessons Learned

Throughout this project, I gained valuable experience with:

1. **AWS Services Integration**: Learning how different AWS services work together to create a complete solution.
2. **Serverless Architecture**: Understanding the benefits and challenges of serverless computing.
3. **Infrastructure as Code**: Appreciating the importance of defining infrastructure in code for reproducibility and consistency.
4. **CI/CD Practices**: Implementing automated workflows to streamline development and deployment.
5. **Cost Optimization**: Designing with AWS free tier and low-cost options in mind.
6. **Security Best Practices**: Implementing proper IAM permissions, HTTPS, and API security.

## Future Improvements

Some enhancements I plan to make:

1. Add more interactive elements to the resume
2. Implement a contact form with Lambda and SES
3. Add a blog section with content stored in DynamoDB
4. Enhance the visitor analytics with more metrics
5. Implement A/B testing for different resume layouts

## Resources

- [Official Cloud Resume Challenge](https://cloudresumechallenge.dev/docs/the-challenge/aws/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 
