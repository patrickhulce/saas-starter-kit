# AWS Integration

## Getting Started

1.  Create an AWS account.
2.  Create a bucket for hosting static assets i.e. `cdn.the-product.com`, [see AWS docs for more.](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
    1.  Create the bucket with the domain name you wish to use.
    2.  Enable public permissions and static hosting.
    3.  Add a bucket policy enabling read on all objects.
    4.  Add a CNAME to `<bucket-name>.s3-website-<AWS-region>.amazonaws.com`.
3.  Create a lambda function.
    1.  Use the `microservice-http-endpoint` blueprint.
    2.  Name the function `the-product-app`.
    3.  Name the role `the-product-app-role`.
    4.  Add any permissions you might use (SNS publish for example).
    5.  Select "Create a new API Gateway".
    6.  Use `The Product App` for API name, `production` for deployment stage, and `Open` security.
    7.  Add all the environment variables in `.envrc` to your lambda configuration.
4.  Configure the created API Gateway.
    1.  Delete the created resources.
    2.  Add a proxy resource and a `/ GET` method.
    3.  Configure both to point to the lambda function from earlier.
5.  Configure CloudWatch logging, [see AWS docs for more](https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/).
    1.  Create a role with `AmazonAPIGatewayPushToCloudWatchLogs`, copy the ARN of the role.
    2.  Open API Gateway overall "Settings" page, paste the ARN into CloudWatch role.
    3.  Enable CloudWatch logs for the production API stage.
6.  Use a custom domain.
    1.  Open certificate manager and request a certificate for your domains.
    2.  Wait for Amazon approval...
    3.  Add a "Custom Domain Name" entry for your domain in API Gateway, select "Edge Optimized", leave path blank, and point to production stage.
    4.  Add a CNAME to the listed cloudfront URL that gets created.

## Deploy Everything

1.  Deploy the frontend. `packages/aws/scripts/deploy-frontend.js cdn.the-product.com/app` _Note the hash that is printed in this step_
2.  Promote the frontend to stable. `packages/aws/scripts/promote-frontend.js stable <hash>`
3.  Deploy the lambda function. `packages/aws/scripts/deploy-lambda.js the-product-app`
