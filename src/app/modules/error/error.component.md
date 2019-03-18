### Error Component

The error component is used to present system errors (or messages) to the user. This will be Blueriq
errors, like 'session expired', 'flow has ended', etc.

**Usage**

```
<bq-error [error]="yourErrorModel" (close)="yourCloseHandler()"></bq-error>
```

The [error] input expects an object of type `ErrorModel` and the `(dismiss)` event handler can be used 
to add behavior in case a non fatal error is dismissed. 
