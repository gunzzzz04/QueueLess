
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
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/backend') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }
    }
}
