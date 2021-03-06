#!groovy

boolean isMaster = BRANCH_NAME == 'master'
String triggerCron = isMaster ? "H 13 * * 7" : ""

properties([
  [
    $class  : 'BuildDiscarderProperty',
    strategy: [$class: 'LogRotator', numToKeepStr: '5']
  ],
  pipelineTriggers([
    cron(triggerCron)
  ]),
  parameters([
    booleanParam(
      name: 'deploySnapshot',
      defaultValue: false,
      description: 'Select if you want to deploy a snapshot to artifactory.'
    ),
    booleanParam(
      name: 'isRelease',
      defaultValue: false,
      description: 'Select if you want to do a release build.'
    ),
    string(
      name: 'releaseVersion',
      defaultValue: '1.0.x',
      description: 'In case of a release-build please provide the release version.'
    ),
    string(
      name: 'developmentVersion',
      defaultValue: '1.0.x-SNAPSHOT',
      description: 'In case of a release-build please provide the next development version.'
    )
  ])
])

node {
  try {
    env.JAVA_HOME = tool 'jdk1.8.0_121'
    def mvnHome = tool "apache-maven-3.5.4"
    env.PATH = "${env.JAVA_HOME}\\bin;${env.PATH};${mvnHome}\\bin;${env.NODEJS_PATH}\""
    env.SASS_BINARY_PATH = env.SASS_BINDING_PATH
    env.CHROME_BIN = env.CHROME_67_0_3396_99;

    stage('checkout') {
      checkout scm
    }

    stage('install') {
      bat 'node -v'
      bat 'yarn -v'
      bat 'yarn install'
      bat 'yarn ng:version'
    }

    stage('verify & build') {
      parallel(
        'test': {
          def result = bat([returnStdout: true, script: "yarn verify"]);
          println result;

          // Unfortunatly it is needed to check if the coverage is not met because the coverage-reporter always exits with error_level=0
          // so we need to make the build unstable manually. you can check the coverage html result to see where it is failing
          if (result.contains('ERROR [reporter.coverage-istanbul]:') || result.contains('WARN [reporter.coverage-istanbul]:')) {
            println 'Unit tests do not meet coverage thresholds, setting the build to unstable';
            currentBuild.result = 'UNSTABLE';
          }
        },
        'tslint': {
          // tslint
          bat 'node_modules\\.bin\\tslint -c src/tslint.json -t checkstyle -p src/tsconfig.app.json -p src/tsconfig.spec.json -o tslint_results_checkstyle.xml'
        },
        'sass-lint': {
          // sass-lint
          bat 'node_modules\\.bin\\sass-lint -f checkstyle --verbose --config sass-lint.yml src/**/*.scss -o sasslint_results_checkstyle.xml'
        },
        'build': {
          if (!params.isRelease) { // maven release executes the yarn build also
            bat "yarn build --progress=false"
          }
        }
      );
    }
    if (params.deploySnapshot) {
      stage('deploy snapshot') {
        bat "mvn clean deploy"
      }
    } else if (params.isRelease) {
      // stage('increment version for release') {
      // bat "yarn version:increment ${params.releaseVersion}"
      // }
      stage('release') {
        bat "mvn -B -DdevelopmentVersion=${params.developmentVersion} -DreleaseVersion=${params.releaseVersion} -Dresume=false release:prepare release:perform"
      }

    } // end if

  } catch (anyException) {
    echo "An error occured (${anyException}) marking build as failed."
    currentBuild.result = 'FAILURE'
  } finally {
    stage("Publish results") {
      // Test results
      step([$class: 'JUnitResultArchiver', testResults: 'testresults/*.xml'])

      // coverage results
      step([$class                    : 'hudson.plugins.cobertura.CoberturaPublisher',
            coberturaReportFile       : 'coverage/cobertura-coverage.xml',
            onlyStable                : false,
            failUnhealthy             : true,
            failUnstable              : true,
            autoUpdateHealth          : false,
            autoUpdateStability       : false,
            zoomCoverageChart         : false,
            failNoReports             : true,
            //                          healthy, unhealthy, failing
            lineCoverageTargets       : '80.0, 80.0, 80.0',
            packageCoverageTargets    : '80.0, 80.0, 80.0',
            fileCoverageTargets       : '80.0, 80.0, 80.0',
            classCoverageTargets      : '80.0, 80.0, 80.0',
            methodCoverageTargets     : '80.0, 80.0, 80.0',
            conditionalCoverageTargets: '80.0, 80.0, 80.0'
      ])

      // lint results
      step([$class                   : 'hudson.plugins.checkstyle.CheckStylePublisher',
            pattern                  : '*_results_checkstyle.xml',
            useStableBuildAsReference: true,
            unstableTotalAll         : '1',
            shouldDetectModules      : true,
            canRunOnFailed           : true])
    }

    if (isMaster && currentBuild.result.equals('SUCCESS')) {
      stage('push to Github') {
        withCredentials([usernamePassword(credentialsId: 'blueriq-8bit_github.com', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
          // We want the tags now that where not fetched in the 'checkout' stage
          bat "git fetch --tags"
          bat "git remote add upstream \"https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/blueriq/blueriq-8bit.git\" "
          // Push only the master branch and all tags to Github
          bat "git push upstream master"
          bat "git push upstream --tags"
        }
      }
    }

    notifyBuildStatus()
    deleteDir()
  }
}// node

def notifyBuildStatus() {
  // notify the person who started the build and the persons who's commits broke the build
  step([$class                  : 'Mailer',
        notifyEveryUnstableBuild: true,
        recipients              : emailextrecipients([
          [$class: 'CulpritsRecipientProvider'],
          [$class: 'RequesterRecipientProvider']
        ])
  ])

  step([$class                  : 'Mailer',
        notifyEveryUnstableBuild: true,
        sendToIndividuals       : true
  ])
}
