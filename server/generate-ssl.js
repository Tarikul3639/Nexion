const fs = require("fs");
const selfsigned = require("selfsigned");

// SSL attributes with more comprehensive information
const attrs = [
  { name: "commonName", value: "localhost" },
  { name: "countryName", value: "US" },
  { name: "stateOrProvinceName", value: "California" },
  { name: "localityName", value: "San Francisco" },
  { name: "organizationName", value: "ChatFly Development" },
  { name: "organizationalUnitName", value: "Development" }
];

// Generate self-signed certificate with extensions
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  extensions: [
    {
      name: "subjectAltName",
      altNames: [
        { type: 2, value: "localhost" },
        { type: 2, value: "127.0.0.1" },
        { type: 7, ip: "127.0.0.1" },
        { type: 7, ip: "::1" }
      ]
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      timeStamping: true
    }
  ]
});

// ssl create if not exists
if (!fs.existsSync("ssl")) fs.mkdirSync("ssl");

// Files save
fs.writeFileSync("ssl/private-key.pem", pems.private);
fs.writeFileSync("ssl/certificate.pem", pems.cert);

console.log("SSL certificates created in ssl/ folder!");
