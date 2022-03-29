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

Apply to cluster
```
kusd -e secrets.yaml | kubectl apply -f -
```

Using file arg
```
kusd -e secrets.yaml
```

Pipe output
```
cat secrets.yaml | kusd -e
```

## License
MIT
