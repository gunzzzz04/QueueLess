pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/gunzzzz04/QueueLess.git'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                sh 'docker build -t queueless-frontend:latest .'
            }
        }

        stage('Docker Build Backend') {
            steps {
                dir('backend/backend') {
                    sh 'docker build -t queueless-backend:latest .'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    docker rm -f queueless-frontend-container || true
                    docker run -d \
                    --name queueless-frontend-container \
                    --restart unless-stopped \
                    -p 3000:80 \
                    queueless-frontend:latest
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    docker rm -f queueless-backend-container || true
                    docker run -d \
                    --name queueless-backend-container \
                    --restart unless-stopped \
                    -p 8081:8081 \
                    queueless-backend:latest
                '''
            }
        }
    }
}