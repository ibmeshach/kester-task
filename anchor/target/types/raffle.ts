/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/raffle.json`.
 */
export type Raffle = {
  "address": "45fqb9u9AG2Jwjco4k8U8wdLUPjPjqCSY5iercuCBk8f",
  "metadata": {
    "name": "raffle",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimNft",
      "discriminator": [
        6,
        193,
        146,
        120,
        48,
        218,
        69,
        33
      ],
      "accounts": [
        {
          "name": "raffle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "winnerTokenAccount",
          "writable": true
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeRaffle",
      "discriminator": [
        220,
        129,
        128,
        51,
        70,
        66,
        209,
        124
      ],
      "accounts": [
        {
          "name": "raffle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        }
      ]
    },
    {
      "name": "enterRaffle",
      "discriminator": [
        153,
        168,
        28,
        44,
        235,
        94,
        238,
        243
      ],
      "accounts": [
        {
          "name": "raffle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "deployer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeRaffle",
      "discriminator": [
        110,
        142,
        92,
        16,
        15,
        58,
        89,
        229
      ],
      "accounts": [
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "raffle",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "nftMint",
          "type": "pubkey"
        },
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "maxEntries",
          "type": "u8"
        },
        {
          "name": "expiryDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "pickWinner",
      "discriminator": [
        227,
        62,
        25,
        73,
        132,
        106,
        68,
        96
      ],
      "accounts": [
        {
          "name": "raffle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  102,
                  102,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "raffle",
      "discriminator": [
        143,
        133,
        63,
        173,
        138,
        10,
        142,
        200
      ]
    }
  ],
  "events": [
    {
      "name": "winnerSelected",
      "discriminator": [
        245,
        110,
        152,
        173,
        193,
        48,
        133,
        5
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyInitialized",
      "msg": "This program has already been initialized."
    },
    {
      "code": 6001,
      "name": "invalidEntryFee",
      "msg": "Entry fee must be greater than 0"
    },
    {
      "code": 6002,
      "name": "invalidMaxEntries",
      "msg": "Maximum entries must be greater than 1 and less than 255"
    },
    {
      "code": 6003,
      "name": "invalidNftMint",
      "msg": "Invalid NFT mint address"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6005,
      "name": "raffleNotActive",
      "msg": "Raffle is not active"
    },
    {
      "code": 6006,
      "name": "raffleNotFound",
      "msg": "Raffle is not found"
    },
    {
      "code": 6007,
      "name": "invalidRaffleEntryFee",
      "msg": "Amount is less than raffle entry fee"
    },
    {
      "code": 6008,
      "name": "maxEntriesReached",
      "msg": "Maximum number of entries reached"
    },
    {
      "code": 6009,
      "name": "alreadyEntered",
      "msg": "User has already entered this raffle"
    },
    {
      "code": 6010,
      "name": "notEnoughEntries",
      "msg": "Not enough entries found, must be at least 1"
    },
    {
      "code": 6011,
      "name": "cannotCloseRaffleWithEntries",
      "msg": "Cannot close raffle when there are entries"
    },
    {
      "code": 6012,
      "name": "operationLocked",
      "msg": "Operation is locked"
    },
    {
      "code": 6013,
      "name": "nftNotTransferred",
      "msg": "NFT not transferred to raffle account"
    },
    {
      "code": 6014,
      "name": "invalidNftSupply",
      "msg": "Invalid NFT supply"
    },
    {
      "code": 6015,
      "name": "missingTokenAccounts",
      "msg": "Missing token accounts"
    },
    {
      "code": 6016,
      "name": "raffleExpired",
      "msg": "Raffle has expired"
    },
    {
      "code": 6017,
      "name": "invalidExpiryDate",
      "msg": "Invalid expiry date - must be in the future"
    },
    {
      "code": 6018,
      "name": "raffleNotExpired",
      "msg": "Raffle has not expired yet"
    },
    {
      "code": 6019,
      "name": "invalidTokenProgram",
      "msg": "Invalid token program"
    },
    {
      "code": 6020,
      "name": "raffleStillActive",
      "msg": "Raffle is still active"
    },
    {
      "code": 6021,
      "name": "winnerNotTheWinner",
      "msg": "Winner is not the winner of the raffle"
    },
    {
      "code": 6022,
      "name": "noWinnerSelected",
      "msg": "No winner has been selected for this raffle"
    }
  ],
  "types": [
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "raffleCount",
            "type": "u64"
          },
          {
            "name": "deployer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "raffle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "maxEntries",
            "type": "u8"
          },
          {
            "name": "entries",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "partialWinner",
            "type": "pubkey"
          },
          {
            "name": "winner",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "locked",
            "type": "bool"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "winnerSelected",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "raffle",
            "type": "pubkey"
          },
          {
            "name": "winner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
