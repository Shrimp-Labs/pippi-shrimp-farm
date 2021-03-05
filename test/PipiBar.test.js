const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const PipiToken = artifacts.require('PipiToken');
const PipiBar = artifacts.require('PipiBar');

contract('PipiBar', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.pipi = await PipiToken.new({ from: minter });
    this.xPipi = await PipiBar.new(this.pipi.address, { from: minter });
  });

  it('mint', async () => {
    await this.xPipi.mint(alice, 1000, { from: minter });
    assert.equal((await this.xPipi.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.xPipi.mint(alice, 1000, { from: minter });
    await this.xPipi.mint(bob, 1000, { from: minter });
    assert.equal((await this.xPipi.totalSupply()).toString(), '2000');
    await this.xPipi.burn(alice, 200, { from: minter });

    assert.equal((await this.xPipi.balanceOf(alice)).toString(), '800');
    assert.equal((await this.xPipi.totalSupply()).toString(), '1800');
  });

  it('safePipiTransfer', async () => {
    assert.equal(
      (await this.pipi.balanceOf(this.xPipi.address)).toString(),
      '0'
    );
    await this.pipi.mint(this.xPipi.address, 1000, { from: minter });
    await this.xPipi.safePipiTransfer(bob, 200, { from: minter });
    assert.equal((await this.pipi.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.pipi.balanceOf(this.xPipi.address)).toString(),
      '800'
    );
    await this.xPipi.safePipiTransfer(bob, 2000, { from: minter });
    assert.equal((await this.pipi.balanceOf(bob)).toString(), '1000');
  });
});
