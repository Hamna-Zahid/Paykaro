terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"  # Change to your preferred region
}

# VPC for the infrastructure
resource "aws_vpc" "banking_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "banking-vpc"
  }
}

# Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id     = aws_vpc.banking_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "banking-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id     = aws_vpc.banking_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "banking-public-subnet-2"
  }
}

# Security group for EC2
resource "aws_security_group" "banking_sg" {
  name_prefix = "banking-sg"
  vpc_id      = aws_vpc.banking_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Restrict in production
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # ALB access
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Airflow webserver
  }

  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Kafka
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 instance for running the pipeline
resource "aws_instance" "banking_pipeline" {
  ami           = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS in us-east-1
  instance_type = "t2.micro"               # Optimized for Free Tier
  key_name      = "your-key-pair"  # Replace with your key pair

  vpc_security_group_ids = [aws_security_group.banking_sg.id]
  subnet_id              = aws_subnet.public_subnet_1.id

  tags = {
    Name = "banking-pipeline-instance"
  }

  user_data = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io docker-compose git
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ubuntu

    # Clone repo and run
    cd /home/ubuntu
    git clone https://github.com/your-repo/banking-realtime-platform.git  # Replace with actual repo
    cd banking-realtime-platform
    docker-compose up -d
  EOF
}

output "instance_public_ip" {
  value = aws_instance.banking_pipeline.public_ip
}