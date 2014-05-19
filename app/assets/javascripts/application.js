// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require angular
//= require angular-resource
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

// The MODULE
var app = angular.module('app', ['ngResource']);


// This Rails Security using Authenticity Token CSRF (Cross Site Request Forgery) token is required by Rails in order for AJAX requests to work.
app.config(function ($httpProvider) {
  // CSRF
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});


// The FACTORY
app.factory('Todo', function($resource) {
  return $resource("/todos/:id.json", {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  })
});


// THE CONTROLLER
app.controller('TodosCtrl', function ($scope, Todo) {

  // Get the todos
  Todo.query(function(data){
    $scope.todos = data;
    // $scope.predicate = '-id';
  });

  // Add Todos
  $scope.addTodo = function (e) {
    e.preventDefault();
    todo = new Todo({title: $scope.nextTodo});
    todo.$save();
    // prepends the new array to the old one, it's faster than unshift, which has to shift everything over.
    $scope.todos = [todo].concat($scope.todos);
    $scope.nextTodo = "";
  };

   // Complete and update todos
  $scope.toggleComplete = function(todo) {
    todo.complete = !todo.complete;
    Todo.update(todo);
  };

  // Delete/Destroy Todo
  $scope.deleteTodo = function (e, todo, index) {
    e.preventDefault();
    Todo.delete(todo);
    $scope.todos.splice(index, 1);
  };

});


