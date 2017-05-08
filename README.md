# ember-foxy-forms

Not just forms, Foxy Forms.


This addon allows you to build simple declarative forms with some snazy features.

More documentation to come.

## FormFor

A form controls a single model.

Coming soon

## FieldFor

Fields extract values from the model and pass them down to form controls, which are specified with the 'using' property.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'foo' using='input' label='Foo'}}

{{/form-for}}
```

Multiple values can be extracted by providing multiple keys to the field-for helper.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'startDate' 'endDate' using='date-range' label='Date Range'}}

{{/form-for}}
```

This will expose a pojo of {startDate, endDate} to the form control. That control must then emit onChange events with 
pojos containing the same key value mappings.

Alternatively you can use the with-mapping property to provide value mapping. This is useful for making generic components.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'foo' 'bar' using='date-range' with-mapping=(hash foo='start-date' bar='end-date') label='Date Range'}}
  
  {{f.field-for 'baz' 'quz' using='date-range' with-mapping=(hash baz='start-date' qux='end-date') label='Date Range'}}

{{/form-for}}
```

TODO: more stuff on the various configurations

# FormControls

A form control is any component which implements the following interface.

TODO: more stuff on the various configurations

```
value: *, // current value of the control
values: [], // optional list of values to select from (handy for buidling selects)
controlId: '', // passed in by the field layer to identify your control
placeholder: '', // optional placeholder text
disabled: true | false, // whether or not this control is disabled
readonly: true | false, // whether or not this control is readonly

onChange(){} // callback function when the values controlled by this control is changed
```


[![Code Climate](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/gpa.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/feed)

[![Test Coverage](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/coverage.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/coverage)

[![Issue Count](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/issue_count.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/feed)

[ ![Codeship Status for Foodee/ember-foxy-forms](https://app.codeship.com/projects/caace390-10be-0135-bdfd-42a6c56c937f/status?branch=master)](https://app.codeship.com/projects/216394)
## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
