// Sample AWS SAP-C02 Questions for Testing
export const sampleQuestions = [
  {
    id: "q1",
    questionText: "A company collects data for temperature, humidity, and atmospheric pressure in cities across multiple continents. The average volume of data that the company collects from each site daily is 500 GB. Each site has a high-speed Internet connection. The company wants to aggregate the data from all these global sites as quickly as possible in a single Amazon S3 bucket. The solution must minimize operational complexity. Which solution meets these requirements?",
    options: [
      {
        id: "a",
        text: "Turn on S3 Transfer Acceleration on the destination S3 bucket. Use multipart uploads to directly upload site data to the destination S3 bucket.",
        isCorrect: true
      },
      {
        id: "b", 
        text: "Upload the data from each site to an S3 bucket in the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket. Then remove the data from the origin S3 bucket.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Schedule AWS Snowball Edge Storage Optimized device jobs daily to transfer data from each site to the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Upload the data from each site to an Amazon EC2 instance in the closest Region. Store the data in an Amazon Elastic Block Store (Amazon EBS) volume. At regular intervals, take an EBS snapshot and copy it to the Region that contains the destination S3 bucket. Restore the EBS volume in that Region.",
        isCorrect: false
      }
    ],
    explanation: "S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads to S3 from anywhere in the world. This is the most efficient solution for high-speed internet connections with minimal operational complexity. Multipart uploads further optimize the transfer of large files.",
    domain: "Design High-Performing Architectures",
    difficulty: "MEDIUM",
    certification: "SAP-C02",
    references: [
      {
        title: "Amazon S3 Transfer Acceleration",
        url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html"
      }
    ],
    tags: ["S3", "Transfer Acceleration", "Global Data Transfer"]
  },
  {
    id: "q2",
    questionText: "A company needs the ability to analyze the log files of its proprietary application. The logs are stored in JSON format in an Amazon S3 bucket. Queries will be simple and will run on-demand. A solutions architect needs to perform the analysis with minimal changes to the existing architecture. What should the solutions architect do to meet these requirements with the LEAST amount of operational overhead?",
    options: [
      {
        id: "a",
        text: "Use Amazon Redshift to load all the content into one place and run the SQL queries as needed.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Use Amazon CloudWatch Logs to store the logs. Run SQL queries as needed from the Amazon CloudWatch console.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Use Amazon Athena directly with Amazon S3 to run the queries as needed.",
        isCorrect: true
      },
      {
        id: "d",
        text: "Use AWS Glue to catalog the logs. Use a transient Apache Spark cluster on Amazon EMR to run the SQL queries as needed.",
        isCorrect: false
      }
    ],
    explanation: "Amazon Athena is a serverless interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. It requires no infrastructure setup and you pay only for the queries you run. This provides the least operational overhead for simple, on-demand queries.",
    domain: "Design High-Performing Architectures",
    difficulty: "EASY",
    certification: "SAP-C02",
    references: [
      {
        title: "Amazon Athena User Guide",
        url: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"
      }
    ],
    tags: ["Athena", "S3", "Serverless Analytics", "SQL Queries"]
  },
  {
    id: "q3",
    questionText: "A company uses AWS Organizations to manage multiple AWS accounts for different departments. The management account has an Amazon S3 bucket that contains project reports. The company wants to limit access to this S3 bucket to only users of accounts within the organization in AWS Organizations. Which solution meets these requirements with the LEAST amount of operational overhead?",
    options: [
      {
        id: "a",
        text: "Add the aws:PrincipalOrgID global condition key with a reference to the organization ID to the S3 bucket policy.",
        isCorrect: true
      },
      {
        id: "b",
        text: "Create an organizational unit (OU) for each department. Add the aws:PrincipalOrgPaths global condition key to the S3 bucket policy.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Use AWS CloudTrail to monitor the CreateAccount, InviteAccountToOrganization, LeaveOrganization, and RemoveAccountFromOrganization events. Update the S3 bucket policy accordingly.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Tag each user that needs access to the S3 bucket. Add the aws:PrincipalTag global condition key to the S3 bucket policy.",
        isCorrect: false
      }
    ],
    explanation: "The aws:PrincipalOrgID condition key allows you to restrict access to only principals (users and roles) that belong to an AWS organization. This is the simplest and most efficient way to control access at the organization level with minimal operational overhead.",
    domain: "Design Secure Architectures",
    difficulty: "MEDIUM",
    certification: "SAP-C02",
    references: [
      {
        title: "AWS Organizations Condition Keys",
        url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_syntax.html"
      }
    ],
    tags: ["Organizations", "S3 Bucket Policy", "IAM", "Security"]
  },
  {
    id: "q4",
    questionText: "An application runs on an Amazon EC2 instance in a VPC. The application processes logs that are stored in an Amazon S3 bucket. The EC2 instance needs to access the S3 bucket without connectivity to the internet. Which solution will provide private network connectivity to Amazon S3?",
    options: [
      {
        id: "a",
        text: "Create a gateway VPC endpoint to the S3 bucket.",
        isCorrect: true
      },
      {
        id: "b",
        text: "Stream the logs to Amazon CloudWatch Logs. Export the logs to the S3 bucket.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Create an instance profile on Amazon EC2 to allow S3 access.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Create an Amazon API Gateway API with a private link to access the S3 endpoint.",
        isCorrect: false
      }
    ],
    explanation: "A VPC Gateway Endpoint for S3 allows EC2 instances in a VPC to access S3 without requiring internet connectivity. The traffic stays within the AWS network, providing secure and private access to S3 resources.",
    domain: "Design Secure Architectures",
    difficulty: "EASY",
    certification: "SAP-C02",
    references: [
      {
        title: "VPC Endpoints for Amazon S3",
        url: "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"
      }
    ],
    tags: ["VPC Endpoint", "S3", "Private Connectivity", "Security"]
  },
  {
    id: "q5",
    questionText: "A company is hosting a web application on AWS using a single Amazon EC2 instance that stores user-uploaded documents in an Amazon EBS volume. For better scalability and availability, the company duplicated the architecture and created a second EC2 instance and EBS volume in another Availability Zone, placing both behind an Application Load Balancer. After completing this change, users reported that, each time they refreshed the website, they could see one subset of their documents or the other, but never all of the documents at the same time. What should a solutions architect propose to ensure users see all of their documents at once?",
    options: [
      {
        id: "a",
        text: "Copy the data so both EBS volumes contain all the documents",
        isCorrect: false
      },
      {
        id: "b",
        text: "Configure the Application Load Balancer to direct a user to the server with the documents",
        isCorrect: false
      },
      {
        id: "c",
        text: "Copy the data from both EBS volumes to Amazon EFS. Modify the application to save new documents to Amazon EFS",
        isCorrect: true
      },
      {
        id: "d",
        text: "Configure the Application Load Balancer to send the request to both servers. Return each document from the correct server",
        isCorrect: false
      }
    ],
    explanation: "Amazon EFS (Elastic File System) provides shared, scalable file storage that can be mounted by multiple EC2 instances simultaneously. This solves the problem of data being split across different EBS volumes and ensures all instances have access to the same documents.",
    domain: "Design Resilient Architectures",
    difficulty: "MEDIUM",
    certification: "SAP-C02",
    references: [
      {
        title: "Amazon Elastic File System",
        url: "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"
      }
    ],
    tags: ["EFS", "Shared Storage", "High Availability", "Load Balancer"]
  },
  {
    id: "q6",
    questionText: "A company uses NFS to store large video files in on-premises network attached storage. Each video file ranges in size from 1 MB to 500 GB. The total storage is 70 TB and is no longer growing. The company decides to migrate the video files to Amazon S3. The company must migrate the video files as soon as possible while using the least possible network bandwidth. Which solution will meet these requirements?",
    options: [
      {
        id: "a",
        text: "Create an S3 bucket. Create an IAM role that has permissions to write to the S3 bucket. Use the AWS CLI to copy all files locally to the S3 bucket.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Create an AWS Snowball Edge job. Receive a Snowball Edge device on premises. Use the Snowball Edge client to transfer data to the device. Return the device so that AWS can import the data into Amazon S3.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Deploy an S3 File Gateway on premises. Create a public service endpoint to connect to the S3 File Gateway. Create an S3 bucket. Create a new NFS file share on the S3 File Gateway. Point the new file share to the S3 bucket. Transfer the data from the existing NFS file share to the S3 File Gateway.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Set up an AWS Direct Connect connection between the on-premises network and AWS. Deploy an S3 File Gateway on premises. Create a public virtual interface (VIF) to connect to the S3 File Gateway. Create an S3 bucket. Create a new NFS file share on the S3 File Gateway. Point the new file share to the S3 bucket. Transfer the data from the existing NFS file share to the S3 File Gateway.",
        isCorrect: false
      }
    ],
    explanation: "AWS Snowball Edge is designed for large-scale data migration scenarios where network bandwidth is limited or expensive. For 70 TB of data, Snowball Edge provides the fastest migration with minimal network bandwidth usage, as the data is physically shipped to AWS.",
    domain: "Design Cost-Optimized Architectures",
    difficulty: "MEDIUM",
    certification: "SAP-C02",
    references: [
      {
        title: "AWS Snowball Edge User Guide",
        url: "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge.html"
      }
    ],
    tags: ["Snowball Edge", "Data Migration", "Large Scale Transfer", "Cost Optimization"]
  },
  {
    id: "q7",
    questionText: "A company has an application that ingests incoming messages. Dozens of other applications and microservices then quickly consume these messages. The number of messages varies drastically and sometimes increases suddenly to 100,000 each second. The company wants to decouple the solution and increase scalability. Which solution meets these requirements?",
    options: [
      {
        id: "a",
        text: "Persist the messages to Amazon Kinesis Data Analytics. Configure the consumer applications to read and process the messages.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Deploy the ingestion application on Amazon EC2 instances in an Auto Scaling group to scale the number of EC2 instances based on CPU metrics.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Write the messages to Amazon Kinesis Data Streams with a single shard. Use an AWS Lambda function to preprocess messages and store them in Amazon DynamoDB. Configure the consumer applications to read from DynamoDB to process the messages.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Publish the messages to an Amazon Simple Notification Service (Amazon SNS) topic with multiple Amazon Simple Queue Service (Amazon SQS) subscriptions. Configure the consumer applications to process the messages from the queues.",
        isCorrect: true
      }
    ],
    explanation: "SNS with SQS subscriptions provides a fan-out messaging pattern that can handle high throughput and scale to support dozens of consumer applications. Each consumer gets its own SQS queue, providing decoupling and independent scaling. SNS can handle 100,000+ messages per second.",
    domain: "Design Resilient Architectures",
    difficulty: "HARD",
    certification: "SAP-C02",
    references: [
      {
        title: "Amazon SNS Fan-out Pattern",
        url: "https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html"
      }
    ],
    tags: ["SNS", "SQS", "Fan-out Pattern", "Decoupling", "High Throughput"]
  },
  {
    id: "q8",
    questionText: "A company is migrating a distributed application to AWS. The application serves variable workloads. The legacy platform consists of a primary server that coordinates jobs across multiple compute nodes. The company wants to modernize the application with a solution that maximizes resiliency and scalability. How should a solutions architect design the architecture to meet these requirements?",
    options: [
      {
        id: "a",
        text: "Configure an Amazon Simple Queue Service (Amazon SQS) queue as a destination for the jobs. Implement the compute nodes with Amazon EC2 instances that are managed in an Auto Scaling group. Configure EC2 Auto Scaling to use scheduled scaling.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Configure an Amazon Simple Queue Service (Amazon SQS) queue as a destination for the jobs. Implement the compute nodes with Amazon EC2 instances that are managed in an Auto Scaling group. Configure EC2 Auto Scaling based on the size of the queue.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Implement the primary server and the compute nodes with Amazon EC2 instances that are managed in an Auto Scaling group. Configure AWS CloudTrail as a destination for the jobs. Configure EC2 Auto Scaling based on the load on the primary server.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Implement the primary server and the compute nodes with Amazon EC2 instances that are managed in an Auto Scaling group. Configure Amazon EventBridge (Amazon CloudWatch Events) as a destination for the jobs. Configure EC2 Auto Scaling based on the load on the compute nodes.",
        isCorrect: false
      }
    ],
    explanation: "Using SQS as a job queue eliminates the single point of failure of the primary server and provides better decoupling. Auto Scaling based on queue depth ensures that compute capacity matches the workload demand, providing both resiliency and scalability for variable workloads.",
    domain: "Design Resilient Architectures",
    difficulty: "HARD",
    certification: "SAP-C02",
    references: [
      {
        title: "Auto Scaling with SQS",
        url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"
      }
    ],
    tags: ["SQS", "Auto Scaling", "Decoupling", "Resiliency", "Variable Workloads"]
  },
  {
    id: "q9",
    questionText: "A company is running an SMB file server in its data center. The file server stores large files that are accessed frequently for the first few days after the files are created. After 7 days the files are rarely accessed. The total data size is increasing and is close to the company's total storage capacity. A solutions architect must increase the company's available storage space without losing low-latency access to the most recently accessed files. The solutions architect must also provide file lifecycle management to avoid future storage issues. Which solution will meet these requirements?",
    options: [
      {
        id: "a",
        text: "Use AWS DataSync to copy data that is older than 7 days from the SMB file server to AWS.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Create an Amazon S3 File Gateway to extend the company's storage space. Create an S3 Lifecycle policy to transition the data to S3 Glacier Deep Archive after 7 days.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Create an Amazon FSx for Windows File Server file system to extend the company's storage space.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Install a utility on each user's computer to access Amazon S3. Create an S3 Lifecycle policy to transition the data to S3 Glacier Flexible Retrieval after 7 days.",
        isCorrect: false
      }
    ],
    explanation: "S3 File Gateway provides a seamless way to extend on-premises storage to the cloud while maintaining SMB protocol compatibility. The local cache ensures low-latency access to frequently accessed files, while S3 Lifecycle policies automatically manage data archival to reduce costs.",
    domain: "Design Cost-Optimized Architectures",
    difficulty: "MEDIUM",
    certification: "SAP-C02",
    references: [
      {
        title: "AWS Storage Gateway File Gateway",
        url: "https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html"
      }
    ],
    tags: ["Storage Gateway", "File Gateway", "S3 Lifecycle", "Hybrid Storage"]
  },
  {
    id: "q10",
    questionText: "A company is building an ecommerce web application on AWS. The application sends information about new orders to an Amazon API Gateway REST API to process. The company wants to ensure that orders are processed in the order that they are received. Which solution will meet these requirements?",
    options: [
      {
        id: "a",
        text: "Use an API Gateway integration to publish a message to an Amazon Simple Notification Service (Amazon SNS) topic when the application receives an order. Subscribe an AWS Lambda function to the topic to perform processing.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Use an API Gateway integration to send a message to an Amazon Simple Queue Service (Amazon SQS) FIFO queue when the application receives an order. Configure the SQS FIFO queue to invoke an AWS Lambda function for processing.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Use an API Gateway authorizer to block any requests while the application processes an order.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Use an API Gateway integration to send a message to an Amazon Simple Queue Service (Amazon SQS) standard queue when the application receives an order. Configure the SQS standard queue to invoke an AWS Lambda function for processing.",
        isCorrect: false
      }
    ],
    explanation: "SQS FIFO (First-In-First-Out) queues guarantee that messages are processed in the exact order they are received. This ensures that orders are processed sequentially, maintaining the required order processing for the ecommerce application.",
    domain: "Design Resilient Architectures",
    difficulty: "EASY",
    certification: "SAP-C02",
    references: [
      {
        title: "Amazon SQS FIFO Queues",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html"
      }
    ],
    tags: ["SQS FIFO", "Order Processing", "API Gateway", "Lambda"]
  }
];

// Export individual questions for easy access
export const question1 = sampleQuestions[0];
export const question2 = sampleQuestions[1];
export const question3 = sampleQuestions[2];
export const question4 = sampleQuestions[3];
export const question5 = sampleQuestions[4];
export const question6 = sampleQuestions[5];
export const question7 = sampleQuestions[6];
export const question8 = sampleQuestions[7];
export const question9 = sampleQuestions[8];
export const question10 = sampleQuestions[9];

// Export by domain for filtering
export const questionsByDomain = {
  "Design Secure Architectures": [question3, question4],
  "Design Resilient Architectures": [question5, question7, question8, question10],
  "Design High-Performing Architectures": [question1, question2],
  "Design Cost-Optimized Architectures": [question6, question9]
};

// Export by difficulty
export const questionsByDifficulty = {
  "EASY": [question2, question4, question10],
  "MEDIUM": [question1, question3, question5, question6, question9],
  "HARD": [question7, question8]
};

export default sampleQuestions;