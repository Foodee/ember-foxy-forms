# Fields

Fields are responsible for connecting form-controls to fields.

## Standard and Composite Values

Fields typically control a single value, but sometimes it's valuable to have them control multiple, for instance when 
controlling a date range. This can be done by simply passing an array of keys to the for attribute.

{{#docs-demo as |demo|}}
  {{#demo.example name="multiple.hbs"}}
    <Form @for={{this.object}} as |f|>
      <f.field @for='attribute' @label='Single Value' />
      <f.field @for={{array "attribute1" "attribute2"}} @label='Multiple' />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "multiple.hbs"}}
{{/docs-demo}}

## Labels

FieldFor has the option to label controls, if you provide a label, field for will automatically wire the label's 'for' 
attribute to the correct id, to allow for a11y.

{{#docs-demo as |demo|}}
  {{#demo.example name="label.hbs"}}
    <Form @for={{this.object}} as |f|>
      <f.field @for='attribute' @label='An Label' />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "label.hbs"}}
{{/docs-demo}}

## Values

Fields also delegate values to their controls, this can be an array passed down from a parent context or a comma delimited
string of the format 'id:label:icon'.

{{#docs-demo as |demo|}}
  {{#demo.example name="values.hbs"}}
    <Form @for={{this.object}} as |f|>
      <f.field 
        @for='attribute' 
        @using='select' 
        @values='1:One,2:Two,3:Three'
       />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "values.hbs"}}
{{/docs-demo}}

## Placeholders

A placeholder may be provided which will be delegated down to the control, and example below.

{{#docs-demo as |demo|}}
  {{#demo.example name="placeholder.hbs"}}
    <Form @for={{this.object}} as |f|>
      <f.field @for='attribute' @placeholder='placeholder' />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "placeholder.hbs"}}
{{/docs-demo}}

## Lifecycle Hooks

Fields expose two lifecycle methods, didCommitValue, didCommitValues, these are useful if you want to 
run processes when individual field values change without using an observer.

{{#docs-demo as |demo|}}
  {{#demo.example name="did-commit.hbs"}}
    <Form @for={{this.object}} as |f|>
      <f.field 
         @for="attribute" 
         @label="Atribute"
         @didCommitValue=this.didCommitValue
      />
      <f.field 
        @for={{array "attribute1" "attribute2"}} 
        @label="Atribute1 & Atribute2"
        @didCommitValues=this.didCommitValues 
      />
    </Form> 
  {{/demo.example}}
  {{demo.snippet "did-commit.hbs"}}
{{/docs-demo}}

## Yielding the control

When customizations to the control are needed the field can yield the control for direct configuration. 

{{#docs-demo as |demo|}}
  {{#demo.example name="yielding.hbs"}}
    <Form @for={{this.object}} as |f|>
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
    <Form @for={{this.object}} @inlineEditing={{true}} @hasControlCallout={{true}}  as |f|>
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
