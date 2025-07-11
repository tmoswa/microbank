provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "microbank_cluster" {
  name = "microbank-cluster"
}

resource "aws_ecs_task_definition" "client_service" {
  family                   = "client-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "client-service"
      image = "<your-ecr-repo>:client-service"
      essential = true
      portMappings = [
        {
          containerPort = 8088
          hostPort      = 8088
        }
      ]
    }
  ])
}