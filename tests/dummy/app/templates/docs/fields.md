# Fields

Fields are responsible for connecting form controls to model/object values.

## Standard and Composite Values

Fields typically control a single value, but sometimes it's valuable to have them control multiple, for instance when 
controlling a date range. This can be done by simply passing an array of keys to the for attribute.

{{#docs-demo as |demo|}}
  {{#demo.example name="multiple.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <label>Single</label>
      <f.field @for='attribute'/>
      <label>Multiple</label>
      <f.field @for={{array "composite1" "composite2"}}/>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "multiple.hbs"}}
{{/docs-demo}}

## Specifying the control

FieldFor accepts a @using parameter, which instructs it to use a particular form control for the field. It uses the following
rubric to lookup your component based on that name:

1. It looks for a custom control in your application with a path matching ```form-controls/<@using>```
2. It looks for a custom control in your application with a path matching ```form-controls/<@using>-control``` this affordance is for legacy projects and will be removed in version 3.0.0
3. It looks for a pre-packaged control in foxy-forms with a path matching ```form-controls/ff-<@using>```

{{#docs-demo as |demo|}}
  {{#demo.example name="using.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <f.field @for='labeledAttribute' @using='input' as |ff|>
        <ff.control/>
      </f.field>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "using.hbs"}}
{{/docs-demo}}

## Field Labels

FieldFor has the option to label controls, if you provide a label, field for will automatically wire the label's 'for' 
attribute to the correct id, to allow for a11y.

{{#docs-demo as |demo|}}
  {{#demo.example name="label.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <f.field @for='labeledAttribute' @using='input' @label='Field Label' as |ff|>
        <ff.control/>
      </f.field>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "label.hbs"}}
{{/docs-demo}}

## Values

Fields also delegate values to their controls, this can be an array passed down from a parent context or a comma delimited
string of the format ```id:label:icon,id:label:icon,id:label:icon```.

{{#docs-demo as |demo|}}
  {{#demo.example name="values.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <f.field 
        @for='select' 
        @using='select' 
        @values='1,2,3'
       />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "values.hbs"}}
{{/docs-demo}}

## Placeholders

A placeholder may be provided which will be delegated down to the control, and example below.

{{#docs-demo as |demo|}}
  {{#demo.example name="placeholder.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <f.field @for='placeholder' @placeholder='placeholder' />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "placeholder.hbs"}}
{{/docs-demo}}

## Lifecycle Hooks

Fields expose two lifecycle methods, didCommitValue, didCommitValues, these are useful if you want to 
run processes when individual field values change without using an observer.

{{#docs-demo as |demo|}}
  {{#demo.example name="did-commit.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}}  as |f|>
      <f.field 
         @for="singleAttribute" 
         @label="Attribute"
         @didCommitValue=this.didCommitValue
      as |ff|>
        <ff.control/>
      </f.field>
      <f.field
      @for={{array "composite1" "composite2"}} 
        @label="Atribute1 & Atribute2"
        @didCommitValues=this.didCommitValues 
      as |ff|>
        <ff.control/>
      </f.field>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "did-commit.hbs"}}
{{/docs-demo}}

## Yielding the control

When customizations to the control are needed the field can yield the control for direct configuration. 

{{#docs-demo as |demo|}}
  {{#demo.example name="yielding.hbs"}}
    <Form @for={{this.object}} @preventsNavigation={{false}} as |f|>
      <f.field @for='number' @using='number' as |f|>
        <f.control @max=100 @min=0 @step=10 />
      </f.field>
      <f.field @for='number' @using='range' as |f|>
        <f.control @max=100 @min=0 @step=10 />
      </f.field>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "yielding.hbs"}}
{{/docs-demo}}

## Control Callout 

When in inline editing mode, it's sometimes useful to have a control callout so you can view the uncommitted values
while you edit in a callout pane. 

{{#docs-demo as |demo|}}
  {{#demo.example name="callout.hbs"}}
    <Form @for={{this.object}} @inlineEditing={{true}} @hasControlCallout={{true}} @preventsNavigation={{false}} as |f|>
      <f.field @for='number' @using='number' as |f|>
        <f.control @max=100 @min=0 @step=10 />
      </f.field>
      <f.field @for='number' @using='range' as |f|>
        <f.control @max=100 @min=0 @step=10 />
      </f.field>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "callout.hbs"}}
{{/docs-demo}}

## Using Live Updating controls

Fields accept an argument called `live` which is passed down to controls. When `live` is set to true, the value of the model will be updated as users type when using text input or textarea. Also, when the form's `autoSubmit` is set to true, `live` will be set to false for fields and controls which can be overridden by passing the arguments to either fields or controls.

{{#docs-snippet name="live.hbs"}}
  <Form @for={{this.object}} @autoSubmit={{true}} as |f|>
    <f.field @for='attribute' /> 
    // internally fields are given @live={{false}} if autoSubmit is on
    // which is then passed down to controls
  </Form> 
{{/docs-snippet}}

## Display Value Component 

When editing in 'inline' mode you may provide a custom control for displaying the value, you do so by providing the 
fully qualified path a component that respects the display value component interface of:

{{#docs-snippet name="custom-display-component.js"}}
  interface DisplayValueComponent {
    // current value of the control
    value: any; 
    // the function that switched the control into edit mode
    editValue: array; 
  }
{{/docs-snippet}}

{{#docs-demo as |demo|}}
  {{#demo.example name="custom-display-component.hbs"}}
    <Form @for={{this.object}} @inlineEditing={{true}} @preventsNavigation={{false}} as |f|>
      <f.field @for='number' @using='number' @displayValueComponent='form-controls/ff-custom-display-value'/>
    </Form> 
  {{/demo.example}}
  {{demo.snippet "custom-display-component.hbs"}}
{{/docs-demo}}
