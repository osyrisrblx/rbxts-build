export class Lazy<T> {
	private isInitialized = false;
	private value: T | undefined;

	constructor(private readonly getValue: () => Promise<T>) {}

	public async get() {
		if (!this.isInitialized) {
			this.isInitialized = true;
			this.value = await this.getValue();
		}
		return this.value as T;
	}
}
