const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe('images', async () => {
    let result
    let imageCount
    const hash = '1234js'

    before(async ()=>{
      result = await decentragram.uploadImage(hash,'Image description',{from: author})
      imageCount = await decentragram.imageCount()

    })

    it('creates-images', async()=>{
      assert.equal(imageCount,1)
      console.log(result.logs[0].args)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(),imageCount.toNumber(),"id is correct")
      assert.equal(event.hash,hash,"hash is correct")
      assert.equal(event.description,"Image description","description is correct")
      assert.equal(event.tipAmount,'0','tip amount is correct')
      assert.equal(event.author, author,"author is correct")

      //FAILURE: Image must have hash
    await decentragram.uploadImage('', 'Image description',{frome:author}).should.be.rejected;

    //FAILURE: Image must have description
    await decentragram.uploadImage('Image hash', '',{frome:author}).should.be.rejected;
    })

    

    it('lists images', async()=>{
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(),imageCount.toNumber(),"id is correct")
      assert.equal(image.hash,hash,"hash is correct")
      assert.equal(image.description,"Image description","description is correct")
      assert.equal(image.tipAmount,'0','tip amount is correct')
      assert.equal(image.author, author,"author is correct")
    })

  })

})