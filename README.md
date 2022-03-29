# kusd

Kubernetes secrets decode/encode (base64)

## Installation

```
npm i -g kusd
```

## Decode

Directly from cluster
```
kubectl get secret your-secret -o yaml | kusd
```

Using file arg
```
kusd secrets-encoded.yaml
```

Pipe output
```
cat secrets-encoded.yaml | kusd
```

## Encode

Using file arg
```
kusd -e secrets.yaml
```

Pipe output
```
cat secrets-encoded.yaml | kusd -e
```

## License
MIT
