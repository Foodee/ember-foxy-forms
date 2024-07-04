# Advanced Use Cases 

## Child Forms

Foxy Forms supports parent/child relationships to better separate concerns for more verbose scenarios. Calling submit on the parent will submit itself, and then call submit any children, breadth-first, afterward. 

**NOTE**: the parent form will only call submit on children with dirty fields.

**Example: product onboarding**

Let's say we want to collect a new user's information during an onboarding flow, and then optionally allow the 'default' part of the avatar name to be updated. We could have two forms: one responsible for collecting general account information, and another specific to handling avatar logic.

{{#docs-demo as |demo|}}
  {{#demo.example name="advanced-usage.hbs"}}
    <Form 
      @for={{this.user}} 
      @onSubmit={{this.handleSubmit}} 
      as |f|>
        <f.field 
          @for="name" 
          @using="input" 
          @label="Username" 
        />
        <div style="border: 1px solid gray; padding: 0.5rem; margin: 1rem">
          <strong>Optional: change avatar description?</strong>
          <Form 
            @for={{this.avatar}} 
            @parentForm={{f.self}} 
            @onSubmit={{this.handleChildSubmit}} 
            as |cf|> 
            <div style="display: flex; align-items: center;">
              {{this.user.name}}-
              <cf.field 
                @for="name" 
                @using="input" 
                required
              />
              -avatar.jpeg
            </div>
          </Form>
        </div>
      <f.submit @text="Submit form" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "advanced-usage.hbs"}}
{{/docs-demo}}
