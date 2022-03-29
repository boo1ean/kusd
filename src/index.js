const yaml = require('yaml')
const parseArgs = require('minimist')
const fs = require('fs').promises

const USAGE_TEXT = `
Kubernetes secrets decode/encode (base64)

DECODE

Directly from cluster:
kubectl get secret your-secret -o yaml | kusd

Using file arg:
kusd secrets-encoded.yaml

Pipe output:
cat secrets-encoded.yaml | kusd

ENCODE

Apply to cluster:
kusd -e secrets.yaml | kubectl apply -f -

Using file arg:
kusd -e secrets-encoded.yaml

Pipe output:
cat secrets-encoded.yaml | kusd -e
`

const args = parseArgs(process.argv.slice(2), { boolean: ['e'] })
const filePath = args._[0]

run()

async function run () {
	const input = await readInput()

	if (!input) {
		console.error(USAGE_TEXT)
		process.exit(1)
	}

	const parsedConfig = parseYaml(input)

	const result = args.e
		? encode(parsedConfig)
		: decode(parsedConfig)

	console.log(result)
}

function readInput () {
	if (filePath) {
		return readFile(filePath)
	}
	return readSTDIN()
}

function readFile (path) {
	return fs.readFile(path, 'utf8');
}

function readSTDIN () {
	if (process.stdin.isTTY) {
		return ''
	}
	return new Promise((resolve, reject) => {
		var data = "";
		process.stdin.on('data', chunk => data += chunk)
		process.stdin.on('error', reject)
		process.stdin.on('end', () => resolve(data))
	})
}

function parseYaml (yamlString) {
	return yaml.parse(yamlString)
}

function encode (parsedConfig) {
	const encodedConfig = encodeConfig(parsedConfig)
	return objectToYaml(encodedConfig)
}

function encodeConfig (config) {
	for (const key in config.data) {
		config.data[key] = Buffer.from(config.data[key], 'utf8').toString('base64')
	}
	return config
}

function objectToYaml (object) {
	return yaml.stringify(object)
}

function decode (parsedConfig) {
	const decodedConfig = decodeConfig(parsedConfig)
	return objectToYaml(decodedConfig)
}

function decodeConfig (config) {
	for (const key in config.data) {
		config.data[key] = Buffer.from(config.data[key], 'base64').toString('utf8')
	}
	return config
}
