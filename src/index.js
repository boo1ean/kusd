const yaml = require('yaml')
const fs = require('fs').promises

const USAGE_TEXT = `Decode Kubernetes secrets (base64)

USAGE:

Directly from cluster:
kubectl get secret your-secret -o yaml | kusd

Using file:
kusd secrets-encoded.yaml

Pipe output:
cat secrets-encoded.yaml | kusd`

run()

async function run () {
	console.log(await decode())
}

async function decode () {
	const input = await readInput()

	if (!input) {
		console.error(USAGE_TEXT)
		process.exit(1)
	}

	const parsedConfig = parseYaml(input)
	const decodedConfig = decodeConfig(parsedConfig)
	return objectToYaml(decodedConfig)
}

function readInput () {
	const filePath = process.argv[2]
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

function decodeConfig (config) {
	for (const key in config.data) {
		config.data[key] = Buffer.from(config.data[key], 'base64').toString('utf8')
	}
	return config
}

function objectToYaml (object) {
	return yaml.stringify(object)
}
