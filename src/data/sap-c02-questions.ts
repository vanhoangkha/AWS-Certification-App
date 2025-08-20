// AWS Solutions Architect Professional (SAP-C02) Sample Questions
// Based on official exam guide and professional-level scenarios

import type { Question } from '@/types'

export const sapC02Questions: Question[] = [
  {
    questionId: 'sap-c02-001',
    certification: 'SAP-C02',
    domain: 'Design Solutions for Organizational Complexity',
    difficulty: 'HARD',
    questionText: `A large enterprise with multiple AWS accounts across different business units needs to implement a centralized logging solution. The solution must:
    - Aggregate logs from all accounts into a central security account
    - Ensure logs cannot be modified or deleted by source accounts
    - Provide real-time analysis capabilities
    - Comply with regulatory requirements for 7-year retention
    - Minimize cross-account data transfer costs
    
    Which combination of services and configurations will meet these requirements? (Select THREE)`,
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Use Amazon CloudWatch Logs with cross-account log destinations in each source account',
      'Implement AWS CloudTrail with organization trail writing to S3 in the security account',
      'Deploy Amazon Kinesis Data Firehose in each source account streaming to central S3 bucket',
      'Configure S3 bucket policies with explicit deny for delete operations from source accounts',
      'Use AWS Organizations SCPs to prevent log deletion across member accounts',
      'Implement Amazon OpenSearch Service with cross-cluster replication for real-time analysis'
    ],
    correctAnswers: [1, 3, 4],
    explanation: `The correct solution involves:
    1. AWS CloudTrail with organization trail - Provides centralized logging for all accounts automatically
    2. S3 bucket policies with explicit deny - Ensures logs cannot be deleted by source accounts, meeting compliance requirements
    3. Amazon OpenSearch Service - Provides real-time analysis capabilities for the aggregated logs
    
    CloudWatch Logs destinations would incur higher cross-account transfer costs. Kinesis Data Firehose adds unnecessary complexity. SCPs alone don't provide the granular control needed for log protection.`,
    references: [
      'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html',
      'https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html',
      'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html'
    ],
    tags: ['cloudtrail', 'organizations', 's3', 'opensearch', 'logging', 'compliance'],
    createdBy: 'admin',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },

  {
    questionId: 'sap-c02-002',
    certification: 'SAP-C02',
    domain: 'Design for New Solutions',
    difficulty: 'HARD',
    questionText: `A financial services company is migrating a legacy monolithic application to AWS. The application processes millions of transactions daily and requires:
    - Sub-100ms response times for transaction processing
    - ACID compliance for all financial transactions
    - Ability to scale to handle 10x traffic during peak periods
    - Zero data loss tolerance
    - Geographic distribution across 3 regions for disaster recovery
    
    The current architecture uses a single Oracle database with complex stored procedures. Which migration strategy and architecture will best meet these requirements?`,
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Migrate to Amazon RDS for Oracle with Multi-AZ deployment and read replicas across regions',
      'Refactor to microservices using Amazon DynamoDB with Global Tables and AWS Lambda',
      'Use Amazon Aurora Global Database with stored procedures migrated to application logic',
      'Implement Amazon DocumentDB with cross-region replication and containerized microservices'
    ],
    correctAnswers: [2],
    explanation: `Amazon Aurora Global Database is the best choice because:
    - Provides sub-100ms response times with local read replicas
    - Maintains ACID compliance required for financial transactions
    - Auto-scaling capabilities can handle 10x traffic spikes
    - Global Database provides <1 second cross-region replication with zero data loss tolerance
    - Stored procedures can be refactored into application logic for better scalability
    
    RDS for Oracle lacks the global distribution and auto-scaling capabilities. DynamoDB doesn't provide ACID compliance across multiple items. DocumentDB is not suitable for financial transaction processing requiring strict consistency.`,
    references: [
      'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html',
      'https://aws.amazon.com/aurora/features/',
      'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html'
    ],
    tags: ['aurora', 'global-database', 'migration', 'financial-services', 'acid-compliance'],
    createdBy: 'admin',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },

  {
    questionId: 'sap-c02-003',
    certification: 'SAP-C02',
    domain: 'Migration Planning',
    difficulty: 'HARD',
    questionText: `A multinational corporation is planning to migrate 500+ applications from on-premises data centers to AWS. The migration must be completed within 18 months with minimal business disruption. The applications include:
    - Legacy mainframe applications with COBOL code
    - Windows-based .NET applications with SQL Server databases
    - Linux-based Java applications with Oracle databases
    - Custom applications with complex interdependencies
    
    Which migration strategy framework should be implemented to ensure successful migration within the timeline?`,
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Use AWS Application Migration Service for lift-and-shift of all applications, then optimize post-migration',
      'Implement the 6 Rs framework with AWS Migration Hub for orchestration and AWS Database Migration Service for databases',
      'Containerize all applications using Amazon ECS and migrate databases to Amazon RDS',
      'Use AWS Server Migration Service for infrastructure and AWS Schema Conversion Tool for all databases'
    ],
    correctAnswers: [1],
    explanation: `The 6 Rs framework with AWS Migration Hub is the most comprehensive approach:
    - Rehost (lift-and-shift): For applications that need quick migration
    - Replatform: For applications that can benefit from minor cloud optimizations
    - Refactor: For applications that need significant changes
    - Retire: For applications that are no longer needed
    - Retain: For applications that cannot be migrated yet
    - Repurchase: For applications that can be replaced with SaaS solutions
    
    AWS Migration Hub provides centralized tracking and orchestration. DMS handles database migrations with minimal downtime. This approach provides the flexibility needed for diverse application types and ensures the 18-month timeline can be met.`,
    references: [
      'https://docs.aws.amazon.com/migrationhub/latest/ug/whatishub.html',
      'https://aws.amazon.com/cloud-migration/strategies/',
      'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html'
    ],
    tags: ['migration', '6rs-framework', 'migration-hub', 'dms', 'enterprise'],
    createdBy: 'admin',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  },

  {
    questionId: 'sap-c02-004',
    certification: 'SAP-C02',
    domain: 'Cost Control',
    difficulty: 'HARD',
    questionText: `A company's AWS bill has grown to $2M monthly across 50+ accounts. The CFO requires:
    - 20% cost reduction within 6 months
    - Detailed cost allocation by business unit and project
    - Automated cost anomaly detection and alerting
    - Predictive cost forecasting for budget planning
    - Chargeback mechanism for internal departments
    
    Which combination of AWS services and strategies will achieve these requirements? (Select FOUR)`,
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Implement AWS Cost and Usage Reports with detailed resource tagging strategy',
      'Deploy AWS Cost Anomaly Detection with custom thresholds for each business unit',
      'Use AWS Budgets with forecasting enabled and automated actions for cost control',
      'Implement Reserved Instances and Savings Plans based on usage patterns analysis',
      'Deploy AWS Trusted Advisor for real-time cost optimization recommendations',
      'Use AWS Cost Explorer API to build custom chargeback dashboards',
      'Implement AWS Organizations with consolidated billing and detailed billing reports'
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation: `The comprehensive cost management solution includes:
    1. AWS Cost and Usage Reports with detailed tagging - Provides granular cost allocation by business unit and project
    2. AWS Cost Anomaly Detection - Automated detection and alerting for unusual spending patterns
    3. AWS Budgets with forecasting - Predictive cost forecasting and automated cost control actions
    4. Reserved Instances and Savings Plans - Can achieve 20% cost reduction through commitment-based pricing
    
    While Trusted Advisor provides recommendations, it's not sufficient for the scale required. Cost Explorer API and Organizations are useful but don't directly address the core requirements as effectively as the selected options.`,
    references: [
      'https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html',
      'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-anomaly-detection.html',
      'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html'
    ],
    tags: ['cost-optimization', 'cur', 'budgets', 'anomaly-detection', 'reserved-instances'],
    createdBy: 'admin',
    createdAt: '2024-02-15T11:30:00Z',
    updatedAt: '2024-02-15T11:30:00Z'
  },

  {
    questionId: 'sap-c02-005',
    certification: 'SAP-C02',
    domain: 'Continuous Improvement for Existing Solutions',
    difficulty: 'HARD',
    questionText: `A media streaming company experiences performance issues during peak viewing hours (8-11 PM). Current architecture includes:
    - Application Load Balancer distributing traffic to EC2 instances
    - Amazon RDS MySQL database with read replicas
    - Amazon CloudFront for content delivery
    - Auto Scaling groups with target tracking policies
    
    Performance metrics show:
    - Database CPU utilization reaches 90% during peak hours
    - Application response times increase from 200ms to 2000ms
    - Auto Scaling takes 5-7 minutes to provision new instances
    - Cache hit ratio on CloudFront is only 60%
    
    Which optimization strategy will provide the most significant performance improvement?`,
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Implement Amazon ElastiCache for Redis with application-level caching and increase CloudFront TTL values',
      'Migrate to Amazon Aurora Serverless v2 with automatic scaling and implement connection pooling',
      'Use AWS Lambda with Amazon API Gateway and DynamoDB for serverless architecture',
      'Implement Amazon ECS with Fargate and Application Load Balancer with sticky sessions'
    ],
    correctAnswers: [0],
    explanation: `ElastiCache for Redis with application-level caching is the best solution because:
    - Reduces database load by caching frequently accessed data (addresses 90% CPU utilization)
    - Provides sub-millisecond response times for cached data (improves 2000ms response times)
    - Increasing CloudFront TTL improves cache hit ratio from 60% to potentially 80-90%
    - Can be implemented without major architectural changes
    - Provides immediate performance benefits during peak hours
    
    Aurora Serverless v2 would help with database scaling but doesn't address the caching issues. Lambda/API Gateway would require complete application refactoring. ECS with Fargate doesn't solve the underlying database performance issues.`,
    references: [
      'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
      'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html',
      'https://aws.amazon.com/caching/best-practices/'
    ],
    tags: ['elasticache', 'performance-optimization', 'caching', 'cloudfront', 'database-optimization'],
    createdBy: 'admin',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },

  {
    questionId: 'sap-c02-006',
    certification: 'SAP-C02',
    domain: 'Design Solutions for Organizational Complexity',
    difficulty: 'HARD',
    questionText: `A healthcare organization with strict HIPAA compliance requirements needs to implement a data lake solution for medical research. Requirements include:
    - Encryption at rest and in transit for all PHI data
    - Audit trail for all data access and modifications
    - Data classification and automatic PII detection
    - Fine-grained access control based on user roles and data sensitivity
    - Integration with existing Active Directory for authentication
    - Ability to share anonymized datasets with external research partners
    
    Which architecture components are essential for this solution? (Select FOUR)`,
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Amazon S3 with server-side encryption using AWS KMS customer-managed keys',
      'AWS Lake Formation with fine-grained access control and data filters',
      'Amazon Macie for automatic PII detection and data classification',
      'AWS CloudTrail with data events logging for comprehensive audit trail',
      'AWS Glue DataBrew for data preparation and anonymization workflows',
      'Amazon Cognito for user authentication and authorization',
      'AWS Directory Service for Microsoft Active Directory integration'
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation: `The essential components for HIPAA-compliant data lake:
    1. Amazon S3 with KMS customer-managed keys - Provides encryption at rest with customer control over encryption keys
    2. AWS Lake Formation - Enables fine-grained access control, data filters, and centralized permissions management
    3. Amazon Macie - Automatically detects and classifies PII/PHI data, essential for HIPAA compliance
    4. AWS CloudTrail with data events - Provides comprehensive audit trail for all data access and modifications
    
    While Glue DataBrew is useful for anonymization, it's not essential for the core architecture. Directory Service integration would be handled through Lake Formation's integration capabilities. Cognito is not suitable for enterprise Active Directory integration.`,
    references: [
      'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html',
      'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html',
      'https://aws.amazon.com/compliance/hipaa-compliance/'
    ],
    tags: ['lake-formation', 'hipaa', 'macie', 'cloudtrail', 'healthcare', 'data-lake'],
    createdBy: 'admin',
    createdAt: '2024-02-15T12:30:00Z',
    updatedAt: '2024-02-15T12:30:00Z'
  },

  {
    questionId: 'sap-c02-007',
    certification: 'SAP-C02',
    domain: 'Design for New Solutions',
    difficulty: 'HARD',
    questionText: `A global e-commerce platform needs to implement a real-time recommendation engine that can:
    - Process 100,000 events per second from user interactions
    - Provide personalized recommendations within 50ms
    - Handle seasonal traffic spikes of 10x normal volume
    - Maintain recommendation accuracy with machine learning models
    - Support A/B testing for different recommendation algorithms
    
    The current batch-based system takes 24 hours to update recommendations. Which real-time architecture will meet these requirements?`,
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Amazon Kinesis Data Streams → Amazon Kinesis Analytics → Amazon DynamoDB → Amazon API Gateway',
      'Amazon MSK → Amazon EMR → Amazon ElastiCache → Application Load Balancer',
      'Amazon Kinesis Data Streams → AWS Lambda → Amazon ElastiCache → Amazon CloudFront',
      'Amazon EventBridge → Amazon SQS → Amazon ECS → Amazon RDS'
    ],
    correctAnswers: [2],
    explanation: `The optimal real-time recommendation architecture uses:
    - Amazon Kinesis Data Streams: Handles 100,000+ events/second with automatic scaling
    - AWS Lambda: Processes events in real-time, can scale to handle 10x traffic spikes automatically
    - Amazon ElastiCache: Provides sub-millisecond response times for recommendation serving (meets 50ms requirement)
    - Amazon CloudFront: Global edge locations for low-latency recommendation delivery
    
    This architecture supports:
    - Real-time processing vs 24-hour batch updates
    - Automatic scaling for traffic spikes
    - A/B testing through Lambda function versions
    - ML model integration through Lambda layers or SageMaker endpoints
    
    Other options either don't meet the latency requirements or lack the real-time processing capabilities needed.`,
    references: [
      'https://docs.aws.amazon.com/kinesis/latest/dev/introduction.html',
      'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html',
      'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html'
    ],
    tags: ['kinesis', 'lambda', 'elasticache', 'real-time', 'recommendations', 'machine-learning'],
    createdBy: 'admin',
    createdAt: '2024-02-15T13:00:00Z',
    updatedAt: '2024-02-15T13:00:00Z'
  },

  {
    questionId: 'sap-c02-008',
    certification: 'SAP-C02',
    domain: 'Migration Planning',
    difficulty: 'HARD',
    questionText: `A manufacturing company operates a critical ERP system on VMware vSphere with the following characteristics:
    - 50 VMs with complex interdependencies
    - 24/7 operations with maximum 4-hour maintenance windows
    - Shared storage using VMware vSAN
    - Custom network configurations with VLANs
    - Disaster recovery site 500 miles away
    
    The company wants to migrate to AWS with minimal downtime and maintain the same network topology. Which migration approach will minimize risk and downtime?`,
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Use AWS Application Migration Service with staged migration and cutover during maintenance windows',
      'Deploy VMware Cloud on AWS and migrate VMs using vMotion technology',
      'Convert VMs to AMIs using VM Import/Export and deploy on EC2 instances',
      'Use AWS Database Migration Service and rebuild applications on AWS native services'
    ],
    correctAnswers: [1],
    explanation: `VMware Cloud on AWS is the optimal solution because:
    - Maintains existing VMware environment and tools (vSphere, vSAN, NSX)
    - Enables live migration using vMotion with minimal downtime
    - Preserves complex interdependencies and network configurations
    - Supports existing disaster recovery processes
    - Allows gradual migration to AWS native services over time
    - Fits within 4-hour maintenance windows for cutover
    
    AWS Application Migration Service would require more extensive testing and longer cutover times. VM Import/Export doesn't preserve the complex interdependencies. DMS is only for databases and would require complete application rebuilding.`,
    references: [
      'https://aws.amazon.com/vmware/',
      'https://docs.vmware.com/en/VMware-Cloud-on-AWS/index.html',
      'https://aws.amazon.com/vmware/vmware-cloud-on-aws-migration/'
    ],
    tags: ['vmware-cloud', 'migration', 'vmotion', 'erp', 'minimal-downtime'],
    createdBy: 'admin',
    createdAt: '2024-02-15T13:30:00Z',
    updatedAt: '2024-02-15T13:30:00Z'
  }
]