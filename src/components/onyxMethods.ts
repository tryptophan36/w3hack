import {
  CredentialType,
  PresentationCredentials,
  PresentationType,
  SchemaURL,
  createVp,
  signVp,
} from "@/components/onyx";
import secureLocalStorage from "react-secure-storage";
import cryptoJS from "crypto-js";
import { addVC, addVP } from "@/firebase/methods";

export const createIssueVC = async (
  address: string,
  schemaURL: string,
  subjectData: {},
  credentialType: string,
  encryptionKey: string
) => {
  await fetch("/api/onyx/issueVC", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, schemaURL, subjectData, credentialType }),
  })
    .then(async (response) => {
      const data = await response.json();
      // get the returned
      if (data) {
        console.log(data);
        console.log(data.vcJwt);
        // storing the vcJWT
        // VC can be decoded by jwtService
        // Stored in credentialName => encryptedJwt
        const encryptedJWT = cryptoJS.AES.encrypt(
          data.vcJwt,
          encryptionKey
        ).toString();
        console.log(encryptedJWT);
        secureLocalStorage.setItem(credentialType, encryptedJWT);

        // store VC on firebase
        await addVC(address, credentialType, data.vc);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // const vcJWT =
  //   "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwidmVyaWZpZWRDdXN0b21lciJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiRGhydXYgQWdhcndhbCJ9LCJjcmVkZW50aWFsU2NoZW1hIjp7ImlkIjoiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL0RocnV2LTIwMDMvQml6VHJ1c3QvZnJvbnRlbmQvc2NoZW1hcy92ZXJpZmllZEN1c3RvbWVyLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifX0sInN1YiI6ImRpZDpldGhyOm1hdGljbXVtOjB4ODk4ZDBEQmQ1ODUwZTA4NkU2QzA5RDJjODNBMjZCYjVGMWZmOEMzMyIsImp0aSI6ImRpZDpldGhyOm1hdGljbXVtOjB4YmZlOTMzQmJFMzM5NGYzQmUyYjRDQzNGNDAzZTFjOWUxQ0NBQWU5ZiIsIm5iZiI6MTY5Njc0OTkxMiwiaXNzIjoiZGlkOmV0aHI6bWF0aWNtdW06MHg2MkM0MzMyMzQ0Nzg5OWFjYjYxQzE4MTgxZTM0MTY4OTAzRTAzM0JmIn0.FqJHy0nswe3PUW1i1FdjP6EiPB4ai2iZF7maJ_HUBc8fPaWJGsh3TWvMBFN0Xfown3jCbim7pxRCxz-yUj1ntQ";
};

export const createVP = async (
  address: `0x${string}`,
  presentatinType: string,
  VCs: string[],
  encryptionKey: string
) => {
  // take in the required VCTypes
  // fetch from local storage and decrypt with users private key
  let vcJWTs: string[] = [];
  console.log(presentatinType, VCs);

  await VCs.forEach((VC) => {
    console.log(VC);
    const encryptedJWT = secureLocalStorage.getItem(VC) as string;
    if (!encryptedJWT) {
      console.log("JWT NOT FOUND");
      return;
    }
    console.log(encryptedJWT);
    const encodedData = cryptoJS.AES.decrypt(encryptedJWT, encryptionKey);
    const jwt = encodedData.toString(cryptoJS.enc.Utf8);
    console.log(jwt);
    vcJWTs.push(jwt);
  });

  // // then createVP for these VCs
  const vp = await createVp(VCs, vcJWTs);

  if (vp) {
    await addVP(address, presentatinType, vp);
    //prepare Holder's DID
    //pass to sign JWT
    const vpJwt = await signVp(null, vp);
    console.log(vpJwt);

    // store the JWT and provide for Verify
    if (vpJwt) {
      const encryptedJWT = cryptoJS.AES.encrypt(
        vpJwt,
        encryptionKey
      ).toString();
      console.log(encryptedJWT);
      secureLocalStorage.setItem(presentatinType, encryptedJWT);
    }
  }

  // const vpJwt =
  //   "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MjgzNzc1NTcsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZVekkxTmtzaUxDSjBlWEFpT2lKS1YxUWlmUS5leUoyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNKZExDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpZG1WeWFXWnBaV1JEZFhOMGIyMWxjaUpkTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnVZVzFsSWpvaVJHaHlkWFlnUVdkaGNuZGhiQ0o5TENKamNtVmtaVzUwYVdGc1UyTm9aVzFoSWpwN0ltbGtJam9pYUhSMGNITTZMeTlqWkc0dWFuTmtaV3hwZG5JdWJtVjBMMmRvTDBSb2NuVjJMVEl3TURNdlFtbDZWSEoxYzNRdlpuSnZiblJsYm1RdmMyTm9aVzFoY3k5MlpYSnBabWxsWkVOMWMzUnZiV1Z5TG1wemIyNGlMQ0owZVhCbElqb2lTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TVRnaWZYMHNJbk4xWWlJNkltUnBaRHBsZEdoeU9tMWhkR2xqYlhWdE9qQjRPRGs0WkRCRVFtUTFPRFV3WlRBNE5rVTJRekE1UkRKak9ETkJNalpDWWpWR01XWm1PRU16TXlJc0ltcDBhU0k2SW1ScFpEcGxkR2h5T20xaGRHbGpiWFZ0T2pCNFltWmxPVE16UW1KRk16TTVOR1l6UW1VeVlqUkRRek5HTkRBelpURmpPV1V4UTBOQlFXVTVaaUlzSW01aVppSTZNVFk1TmpjME9Ua3hNaXdpYVhOeklqb2laR2xrT21WMGFISTZiV0YwYVdOdGRXMDZNSGcyTWtNME16TXlNelEwTnpnNU9XRmpZall4UXpFNE1UZ3haVE0wTVRZNE9UQXpSVEF6TTBKbUluMC5GcUpIeTBuc3dlM1BVVzFpMUZkalA2RWlQQjRhaTJpWkY3bWFKX0hVQmM4ZlBhV0pHc2gzVFd2TUJGTjBYZm93bjNqQ2JpbTdweFJDeHoteVVqMW50USJdfSwianRpIjoiZGlkOmV0aHI6bWF0aWNtdW06MHhCMDk2QTE2Y0NjNjZDMUZhQTkxNUMwMTM0ZDAyYTE3NjlhODBGNzc2IiwibmJmIjoxNjk2NzU1MTU4LCJpc3MiOiJkaWQ6ZXRocjpudWxsOjB4ODk4ZDBEQmQ1ODUwZTA4NkU2QzA5RDJjODNBMjZCYjVGMWZmOEMzMyJ9.bUGkrvxyzpCuEdQB1KXoxudxNwZ4pZuZk9FpCTddhbXoXClBsL7tzZ8ep9D-NsCw0_I4L7LZc4785UdtJ_2qpA";
};

export const verifyVP = async (VP: string, encryptionKey: string) => {
  const encryptedJWT = secureLocalStorage.getItem(VP) as string;
  if (!encryptedJWT) {
    console.log("JWT NOT FOUND");
    return;
  }
  console.log(encryptedJWT);
  const encodedData = cryptoJS.AES.decrypt(encryptedJWT, encryptionKey);
  const jwt = encodedData.toString(cryptoJS.enc.Utf8);
  console.log(jwt);
  if (jwt) {
    const result = await fetch("/api/onyx/verifyVP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ VP, vpJWT: jwt }),
    })
      .then(async (response) => {
        const data = await response.json();
        // get the returned
        console.log(data);
        return data.isVerified;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
};
