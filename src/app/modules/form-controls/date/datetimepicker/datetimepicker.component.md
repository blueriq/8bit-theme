### Datetimepicker
For the datetimepicker we have chosen to use the ng-pick-datetime component: https://libraries.io/npm/ng-pick-datetime. It is regularly released and is compatible with Angular 6.
It supports different locales by utilizing the MomentJS library.

#### Datatype
The datepicker is a field with the datatype `date`.

#### Disabled & read only
When the attribute has a presentation style `Disabled` the datepicker is greyed out.

When the attribute has a read only flag, only the value of the attribute is presented (as text). If the attribute does not have a value, nothing is shown.
