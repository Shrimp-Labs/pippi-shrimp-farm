const { assert } = require("chai");

const PipiToken = artifacts.require('PipiToken');

contract('PipiToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.pipi = await PipiToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.pipi.mint(alice, 1000, { from: minter });
        assert.equal((await this.pipi.balanceOf(alice)).toString(), '1000');
    })
});
