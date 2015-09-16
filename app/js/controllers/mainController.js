//We use exports to expose the function, which we then have access to in app.js since it's part of the requirements.
module.exports = function($scope) {
    $scope.testAngular = "Angular runs and testing...";
    console.log("required!");
};
