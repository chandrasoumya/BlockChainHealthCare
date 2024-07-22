const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const ownerName = "Dr. AK Roy";

module.exports = buildModule("Healthcare", (m) => {
  const healthcare = m.contract("Healthcare", [ownerName]);

  return { healthcare };
});

// Deployed address - 0x5FbDB2315678afecb367f032d93F642f64180aa3
