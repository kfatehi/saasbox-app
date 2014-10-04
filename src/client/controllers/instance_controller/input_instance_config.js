/** @jsx React.DOM */
var Modal = require('../../components/modal')(React)

module.exports = function(product, instance, cb) {
  var modal = null;
  var valueChanged = function(e, a) {
    var key = $(e.target).data('key')
    instance.config[key] = e.target.value
  }
  var fields = [];

  for (key in product.configSchema) {
    var field = product.configSchema[key]
    fields.push(
      <div className="form-group" key={key}>
        <label htmlFor={key} className="control-label col-sm-4">{field.label}</label>
        <div className="col-sm-8">
          <input type="text" className="form-control" data-key={key}
            onChange={valueChanged}
            placeholder={field.placeholder||''}
            defaultValue={instance.config[key]} />
        </div>
      </div>
    )
  }

  var body = <div>
    <form className="form-horizontal" role="form">
      {fields}
    </form>
  </div>
  var cancel = function() {
    instance.config = null;
    modal.hide();
  }
  var next = function() {
    modal.hide()
  }
  modal = createModal(<Modal 
    className='instanceConfigModal'
    title="Configure"
    body={body}
    onShown={function($el) {
      console.log('shown')
    }}
    footer={
      <div>
        <button type="submit" onClick={next} className="btn btn-primary">Continue</button>
        <button type="button" onClick={cancel} className="pull-left btn btn-default">Cancel</button>
      </div>
    }
    onHidden={function() {
      console.log(instance.config)
      if (instance.config) {
        cb(null, instance.config)
      } else {
        cb(new Error('Invalid configuration'))
      }
    }}
  />)
  modal.show();
}