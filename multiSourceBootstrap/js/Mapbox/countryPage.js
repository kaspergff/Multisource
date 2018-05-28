var ViewModel = function(first) {
    //this.firstName = ko.observable(first);
    this.description = ko.observable(first);
 
//    this.fullName = ko.pureComputed(function() {
//        // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
//        return this.firstName() + " " + this.lastName();
//    }, this);
};
 
