# ember-foxy-forms

## Compatibility

- Ember.js v3.13 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```bash
ember install my-addon
```

## Usage

```hbs
<Form @for={{this.model}} as |form|>
   <f.field @for="attribute" @using="input" />
</Form>
```

Not just forms, Foxy Forms.

This addon allows you to build simple declarative forms with some snazy features. It is UI framework agnostic and generates
minimal dom, so as to not interfere with what ever UI framework you might be using.

You can read more in the [docs here](https://foodee.github.io/ember-foxy-forms/)

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
