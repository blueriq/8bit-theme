### SnackBar
To show validations errors and warnings we are using https://www.npmjs.com/package/ngx-toastr.

### SnackBar & Blueriq
To use ngx-toastr there is introduced the: `validations effects`. In the first step of the file 
validation.effect.ts we look if there is a event with the name: `ButtonPressHandledAction`. If this event
is there, then we look if there are validations. Here we used the sessionStore.

The next step is to look, if there is an event ButtonPressHandledAction, to the sessionName. After that we look
if there is a elementKey and if there is an instance of Button and on the instance an element with a validation.

Then we look if there are errors or validations on the page. If the validation error message is not present, the 
default text we will show is: `There are validation errors on the page`.
For the validation warning message it is: `There are validation warnings on the page`.

## Duration
The standard duration is 5 seconds. 
The duration can be changed in the file: validation.effect.ts at the `showToast`.



