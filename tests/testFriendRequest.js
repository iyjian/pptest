const payload = {
  contactId: 'keji_xihuanhh',
  hello: '我是斩月',
  id: 'ef5f3999-792e-4299-bcc7-612758345933',
  stranger: 'v1_563fbf8c435f7a6fd79ae3f873eba4c5137ea34716292edb1f31e9bd36f2c5a1c65ac7593c7e09deaa4903428dc78777@stranger',
  ticket: 'v1_563fbf8c435f7a6fd79ae3f873eba4c5137ea34716292edb1f31e9bd36f2c5a1c65ac7593c7e09deaa4903428dc78777@stranger',
  timestamp: 1567499415199,
  type: 2
}

module.exports = async (adapter) => {
  adapter.sendHubEvent('FRIENDREQUEST', { content: payload })
}
