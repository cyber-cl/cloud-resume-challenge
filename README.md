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
