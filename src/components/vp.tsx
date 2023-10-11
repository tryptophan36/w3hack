import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getVP,
  getVPs,
  updateTrustScore,
  verifyCompany,
} from "@/firebase/methods";
import { createIssueVC, createVP, verifyVP } from "./onyxMethods";
import {
  CredentialType,
  PresentationCredentials,
  PresentationType,
  SchemaURL,
} from "./onyx";

const VP = (props: any) => {
  const [encryptionKey, setEncryptionKey] = useState<string>("5249");
  const [hasEntityProof, setHasEntityProof] = useState<boolean>(false);
  const [hasVerifiedProof, setHasVerifiedProof] = useState<boolean>(false);
  const [newTrustScore, setNewTrustScore] = useState<number>(0);

  const [VPs, setVPs] = useState<any[]>();
  const address = props.address;

  useEffect(() => {
    if (address) {
      if (!VPs) {
        getVPsInfo(address);
        setNewTrustScore(500);
      }
    }
  }, [address]);

  const getVPsInfo = async (address: `0x${string}`) => {
    const data = await getVPs(address);
    console.log(data);
    // array of Vps
    // type PresentationPayload {
    //   '@context': string | string[]
    //   type: string | string[]
    //   id?: string
    //   verifiableCredential?: VerifiableCredential[]
    //   holder: string
    //   verifier?: string | string[]
    //   issuanceDate?: string
    //   expirationDate?: string
    // }

    const entityData = await getVP(address, PresentationType.PROOF_OF_ENTITY);
    if (entityData) {
      setHasEntityProof(true);
    }

    const verifiedData = await getVP(
      address,
      PresentationType.PROOF_OF_VERIFIED_CUSTOMER
    );
    if (verifiedData) {
      setHasVerifiedProof(true);
    }

    // We also have types to be inferred from the name of the Payload
    setVPs(data);
  };

  const generateEntityVP = async () => {
    if (!encryptionKey) {
      console.log("ENCRYPTION KEY NOT PROVIDED");
      return;
    }
    // create VP for PROOF of entity
    await createVP(
      address,
      PresentationType.PROOF_OF_ENTITY,
      PresentationCredentials.PROOF_OF_ENTITY,
      encryptionKey
    );
    // Verify the VP
    await verifyVP(PresentationType.PROOF_OF_ENTITY, encryptionKey);

    // issue verified VC
    await createIssueVC(
      address,
      SchemaURL.SCHEMA_VERIFIED_CUSTOMER,
      {
        name: props.name,
      },
      CredentialType.VERIFIED_CUSTOMER,
      encryptionKey
    );
  };

  const generateVerifiedVP = async () => {
    // take the Proof OF Verified Customer VC ,& Create VP
    await createVP(
      address,
      PresentationType.PROOF_OF_VERIFIED_CUSTOMER,
      PresentationCredentials.PROOF_OF_VERIFIED_CUSTOMER,
      encryptionKey
    );
    // Verify the VP
    await verifyVP(PresentationType.PROOF_OF_VERIFIED_CUSTOMER, encryptionKey);

    // update Verification Status in Firebase
    await verifyCompany(address);

    // prompt user to claim new VC for verifing
    generateTrustScoreVC("600");
  };

  const handleTrustScore = () => {};

  const generateTrustScoreVC = async (newScore: string) => {
    await createIssueVC(
      address,
      SchemaURL.SCHEMA_TRUST_SCORE_CREDENTIAL,
      {
        name: props.name,
        score: newScore,
      },
      CredentialType.VERIFIED_CUSTOMER,
      encryptionKey
    );

    setNewTrustScore(Number(newScore));
  };

  const generateTrustScoreVP = async () => {
    // take the Proof OF Verified Customer VC ,& Create VP
    await createVP(
      address,
      PresentationType.PROOF_OF_TRUST_SCORE,
      PresentationCredentials.PROOF_OF_TRUST_SCORE,
      encryptionKey
    );
    // Verify the VP
    const isVerified = await verifyVP(
      PresentationType.PROOF_OF_TRUST_SCORE,
      encryptionKey
    );

    //add Score to database
    if (isVerified) {
      await updateTrustScore(address, newTrustScore);
    }
  };

  return (
    <div>
      <div className="bg-slate-100 h-full">
        <div className="mt-10">
          <div className="w-5/6 bg-white px-10 py-6 flex flex-col mx-auto rounded-xl">
            <div>
              <p className="text-2xl font-semibold text-black">
                Your Verifiable Proofs
              </p>
            </div>
            <div className="mt-8 flex">
              <div className="w-1/3  flex flex-col justify-center mx-3 shadow-xl rounded-xl px-3 py-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-500 ">
                    Proof of Registration
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-md font-semibold text-slate-400">
                    Submitted Credentials
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
              </div>
              <div className="w-1/3 flex flex-col justify-center mx-3 shadow-xl rounded-xl px-3 py-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-500">
                    Proof of Registration
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-md font-semibold text-slate-400">
                    Submitted Credentials
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
              </div>
              <div className="w-1/3 flex flex-col justify-center mx-3 shadow-xl rounded-xl px-3 py-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-500 ">
                    Proof of Registration
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-md font-semibold text-slate-400">
                    Submitted Credentials
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-black font-semibold">
                    Proof of Registration
                  </p>
                  <p className="text-slate-500 text-sm font-semibold">
                    Status: <span className="text-green-500">Valid</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-5/6 bg-white px-10 py-6 flex flex-col mx-auto rounded-xl mt-20">
            <div>
              <p className="text-2xl font-semibold text-black">
                Create Verifiable Proofs
              </p>
            </div>
            {!hasEntityProof && (
              <div className="mt-4">
                <button
                  className="w-full text-start px-10 py-4 bg-white hover:scale-105 duration-300 rounded-xl border border-gray-300"
                  onClick={() => {
                    generateEntityVP();
                  }}
                >
                  <div className="flex justify-between">
                    <p className="text-black text-xl font-semibold">
                      Generate Proof of Entity
                    </p>
                    <div>
                      <p className="text-md font-semibold text-slate-600">
                        VC's required
                      </p>
                      <ul className="list-disc mt-1 text-xs">
                        <li>Proof Of Name</li>
                        <li>Proof Of Address</li>
                        <li>Proof of Tax</li>
                        <li>Proof of Registration</li>
                      </ul>
                    </div>
                  </div>
                </button>
              </div>
            )}
            {!hasVerifiedProof && (
              <div className="mt-4">
                <button
                  className="w-full text-start px-10 py-4 bg-white hover:scale-105 duration-300 rounded-xl border border-gray-300"
                  onClick={() => {
                    generateVerifiedVP();
                  }}
                >
                  <div className="flex justify-between">
                    <p className="text-black text-xl font-semibold">
                      Generate Proof of Verified Customer
                    </p>
                    <div>
                      <p className="text-md font-semibold text-slate-600">
                        VC's required
                      </p>
                      <ul className="list-disc mt-1 text-xs">
                        <li>Proof of Verified Customer</li>
                      </ul>
                    </div>
                  </div>
                </button>
              </div>
            )}

            <div className="mt-4">
              <button
                className="w-full text-start px-10 py-4 bg-white hover:scale-105 duration-300 rounded-xl border border-gray-300"
                onClick={() => {
                  generateTrustScoreVP();
                }}
              >
                <div className="flex justify-between">
                  <p className="text-black text-xl font-semibold">
                    Generate Proof of Score Presentation
                  </p>
                  <div>
                    <p className="text-md font-semibold text-slate-600">
                      VC's required
                    </p>
                    <ul className="list-disc mt-1 text-xs">
                      <li>Trust Score Credential</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="w-5/6 bg-white px-10 py-6 flex flex-col mx-auto rounded-xl mt-20">
            <div>
              <p className="text-2xl font-semibold text-black">
                Create Verifiable Credentials
              </p>
            </div>
            <div className="mt-4">
              <button
                className="w-full text-start px-10 py-4 bg-white hover:scale-105 duration-300 rounded-xl border border-gray-300"
                onClick={() => {
                  handleTrustScore();
                }}
              >
                <div className="flex justify-between">
                  <p className="text-black text-xl font-semibold">
                    Generate Trust Score Credential
                  </p>
                  {/* <div>
                    <p className="text-md font-semibold text-slate-600">
                      VC's required
                    </p>
                    <ul className="list-disc mt-1 text-xs">
                      <li>Trust Score Credential</li>
                    </ul>
                  </div> */}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VP), { ssr: false });
