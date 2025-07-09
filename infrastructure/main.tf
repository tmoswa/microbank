provider "aws" {
  region = "us-east-1"
}
resource "aws_rds_instance" "microbank_db" {
  identifier          = "microbank-db"
  engine             = "postgres"
  instance_class     = "db.t4g.micro"
  allocated_storage  = 20
  username           = "user"
  password           = "password"
  publicly_accessible = true
  skip_final_snapshot = true
}