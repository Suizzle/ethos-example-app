import { useCallback, useEffect, useState } from 'react'
import { ethos, Transaction } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Mint = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);

    const mint = useCallback(async () => {
        if (!wallet?.currentAccount) return;
    
        try {
          const transaction = new Transaction();
          transaction.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
            arguments: [
              transaction.pure("Ethos Example NFT"),
              transaction.pure("A sample NFT from Ethos Wallet."),
              transaction.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png"),
            ]
          })
    
          const response = await wallet.signAndExecuteTransaction({
            transaction,
            options: {
              showInput: true,
              showEffects: true,
              showEvents: true,
            }
          });
          console.log("RESPONSE", response);
          
          if (response?.effects?.events) {
            const moveEventEvent = response.effects.events.find(
              (e) => ('moveEvent' in e)
            );
            if (!moveEventEvent || !('moveEvent' in moveEventEvent)) return;

            const { moveEvent } = moveEventEvent;
            setNftObjectId(moveEvent.fields?.object_id)
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setNftObjectId(null)
    }, [])

    useEffect(() => {
        reset()
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the DevNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
            >
                Mint an NFT
            </button>
        </div>
    )
}

export default Mint;