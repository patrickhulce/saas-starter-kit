# AWS Integration

## Getting Started

1.  Create an AWS account.
1.  Create a bucket for hosting static assets i.e. `cdn.the-product.com`, [see AWS docs for more.](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
    1.  Create the bucket with the domain name you wish to use.
    1.  Enable public permissions and static hosting.
    1.  Add a bucket policy enabling read on all objects.
    1.  Add a CNAME to `<bucket-name>.s3-website-<AWS-region>.amazonaws.com`.
1.  Create a lambda function.
    1.  Use the `microservice-http-endpoint` blueprint.
    1.  Name the function `the-product-app`.
    1.  Name the role `the-product-app-role`.
    1.  Add any permissions you might use (SNS publish for example).
    1.  Select "Create a new API Gateway".
    1.  Use `The Product App` for API name, `production` for deployment stage, and `Open` security.
    1.  Add all the environment variables in `.envrc` to your lambda configuration.
1.  Configure the created API Gateway.
    1.  Delete the created resources.
    1.  Add a proxy resource and a `/ GET` method.
    1.  Configure both to point to the lambda function from earlier.
1.  Configure CloudWatch logging, [see AWS docs for more](https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/).
    1.  Create a role with `AmazonAPIGatewayPushToCloudWatchLogs`, copy the ARN of the role.
    1.  Open API Gateway overall "Settings" page, paste the ARN into CloudWatch role.
    1.  Enable CloudWatch logs for the production API stage.
1.  Use a custom domain.
    1.  Open certificate manager and request a certificate for your domains.
    1.  Wait for Amazon approval...
    1.  Add a "Custom Domain Name" entry for your domain in API Gateway, select "Edge Optimized", leave path blank, and point to production stage.
    1.  Add a CNAME to the listed cloudfront URL that gets created.

## Deploy Everything

1.  Deploy the frontend. `./scripts/deploy-frontend.js cdn.the-product.com/app` _Note the hash that is printed in this step_
1.  Promote the frontend to stable. `./scripts/promote-frontend.js stable <hash>`
1.  Deploy the lambda function. `./scripts/deploy-lambda.js the-product-app`
