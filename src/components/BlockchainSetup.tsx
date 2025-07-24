import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  Link, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Clock,
  Hash
} from "lucide-react";
import { toast } from "sonner";

interface WatermarkLog {
  watermarkId: string;
  timestamp: number;
  txHash: string;
}

const BlockchainSetup = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [watermarkId, setWatermarkId] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState<WatermarkLog[]>([]);

  // Smart contract ABI and bytecode
  const contractABI = [
    {
      "inputs": [
        {"internalType": "string", "name": "_watermarkId", "type": "string"}
      ],
      "name": "logWatermark",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "name": "watermarkLogs",
      "outputs": [
        {"internalType": "string", "name": "watermarkId", "type": "string"},
        {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
        {"internalType": "address", "name": "creator", "type": "address"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLogCount",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const contractBytecode = "0x608060405234801561001057600080fd5b50610441806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063371303c014610046578063a26759cb14610062578063b96f1e2714610080575b600080fd5b61004e610092565b60405161005991906102a1565b60405180910390f35b61006a6100a1565b60405161007791906102a1565b60405180910390f35b61009061008b3660046102bc565b6100b0565b005b60006100a060005490565b905090565b6000805460019081019091559052565b6100b86101d5565b6040518060600160405280836040516020016100d491906103a5565b6040516020818303038152906040528152602001428152602001336001600160a01b031681525060008054815481106101105761011061033b565b60009182526020918290208351600390920201908155908201516001820155604090910151600290910180546001600160a01b0319166001600160a01b0390921691909117905580546001908101909155604051829033907f6c17b1d85b1e4f8e3e5e1e5e8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d91a350565b6040518060600160405280606081526020016000815260200160006001600160a01b031681525090565b6000602082840312156101f157600080fd5b81356001600160401b038082111561020857600080fd5b818401915084601f83011261021c57600080fd5b81358181111561022e5761022e610372565b604051601f8201601f19908116603f0116810190838211818310171561025657610256610372565b8160405282815287602084870101111561026f57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000819050919050565b61029b8161028f565b82525050565b60006020820190506102b66000830184610292565b92915050565b6000602082840312156102ce57600080fd5b81356001600160401b038111156102e557600080fd5b6102f1848285016101df565b949350505050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561033457808201518184015260208101905061031957565b50506000910152565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006103a6826102f9565b6103b08185610304565b93506103c0818560208601610315565b6103c981610388565b840191505092915050565b60006020820190508181036000830152610399818461039b565b905092915050565b7f4c6f6767696e6720776174657266656e747473205b000000000000000000000000600082015250565b600061040260148361030a565b915061040d826103c6565b601482019050919050565b6000602082019050818103600083015261043181610395565b905091905056fea26469706673582212201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef64736f6c63430008130033";

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to Sepolia testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          });
        } catch (switchError: any) {
          // If Sepolia is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          }
        }

        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        toast.success("Wallet connected to Sepolia testnet");
      } else {
        toast.error("MetaMask not found. Please install MetaMask extension.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const deployContract = async () => {
    if (!web3 || !account) {
      toast.error("Please connect wallet first");
      return;
    }

    setIsDeploying(true);
    setDeployProgress(0);

    try {
      toast.info("Deploying smart contract...");
      
      const contractInstance = new web3.eth.Contract(contractABI);
      
      // Simulate deployment progress
      const progressInterval = setInterval(() => {
        setDeployProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const deployTx = contractInstance.deploy({
        data: contractBytecode,
        arguments: []
      });

      const gas = await deployTx.estimateGas({ from: account });
      const gasLimit = Math.round(Number(gas) * 1.2);
      
      const deployedContract = await deployTx.send({
        from: account,
        gas: gasLimit.toString()
      });

      clearInterval(progressInterval);
      setDeployProgress(100);
      
      setContractAddress(deployedContract.options.address);
      setContract(deployedContract);
      
      toast.success("Smart contract deployed successfully!");
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Failed to deploy contract");
    } finally {
      setIsDeploying(false);
    }
  };

  const logWatermark = async () => {
    if (!contract || !watermarkId.trim()) {
      toast.error("Please enter a watermark ID");
      return;
    }

    setIsLogging(true);
    try {
      toast.info("Logging watermark to blockchain...");
      
      const tx = await contract.methods.logWatermark(watermarkId).send({
        from: account
      });

      const newLog: WatermarkLog = {
        watermarkId,
        timestamp: Date.now(),
        txHash: tx.transactionHash
      };

      setLogs(prev => [newLog, ...prev]);
      setWatermarkId('');
      
      toast.success("Watermark logged to blockchain!");
    } catch (error) {
      console.error("Logging error:", error);
      toast.error("Failed to log watermark");
    } finally {
      setIsLogging(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        });
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Blockchain Watermark Registry
          </CardTitle>
          <CardDescription>
            Connect to Sepolia testnet and deploy a smart contract to log video watermark IDs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection */}
          <div className="space-y-4">
            <Label>Wallet Connection</Label>
            {!isConnected ? (
              <Button onClick={connectWallet} className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask to Sepolia
              </Button>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium text-green-800">Wallet Connected</p>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Contract Deployment */}
          <div className="space-y-4">
            <Label>Smart Contract Deployment</Label>
            
            {!contractAddress ? (
              <div className="space-y-4">
                <Button 
                  onClick={deployContract} 
                  disabled={!isConnected || isDeploying}
                  className="w-full"
                >
                  {isDeploying ? "Deploying..." : "Deploy Watermark Contract"}
                </Button>

                {isDeploying && (
                  <div className="space-y-2">
                    <Label>Deployment Progress</Label>
                    <Progress value={deployProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Deploying to Sepolia testnet... {Math.round(deployProgress)}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium text-blue-800">Contract Deployed Successfully!</p>
                    
                    <div className="space-y-2">
                      <Label className="text-blue-700">Contract Address</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs flex-1">
                          {contractAddress}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Watermark Logging */}
          {contractAddress && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <Label>Log Watermark ID</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter watermark ID (e.g., wm_123456)"
                    value={watermarkId}
                    onChange={(e) => setWatermarkId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={logWatermark}
                    disabled={isLogging || !watermarkId.trim()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isLogging ? "Logging..." : "Log to Blockchain"}
                  </Button>
                </div>
              </div>

              {/* Recent Logs */}
              {logs.length > 0 && (
                <div className="space-y-4">
                  <Label>Recent Watermark Logs</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3" />
                            <span className="font-mono">{log.watermarkId}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-mono">{log.txHash}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Network Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Sepolia Testnet Information</p>
                <p className="text-sm">
                  This component connects to Ethereum's Sepolia testnet for development and testing.
                  Make sure you have Sepolia ETH for gas fees.
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Network: Sepolia Testnet</li>
                  <li>• Chain ID: 11155111</li>
                  <li>• Get test ETH: <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sepolia Faucet</a></li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainSetup;