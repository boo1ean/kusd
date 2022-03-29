# kusd

Decode kubernetes secrets (from base64)

## Installation

```
npm i -g kusd
```

## Usage

Directly from cluster
```
kubectl get secret your-secret -o yaml | kusd
```

Using file
```
kusd secrets-encoded.yaml
```

Pipe output
```
cat secrets-encoded.yaml | kusd
```

## License
MIT
