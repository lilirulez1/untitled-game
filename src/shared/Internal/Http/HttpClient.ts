import {HttpRequest} from "./HttpRequest";

export class HttpClient {
	headers!: Record<string, string>;
	data!: Record<string, string | { [Key: string]: string }>;

	constructor(private readonly url: string) {}

	request(endpoint: string) {
		return new HttpRequest(this, endpoint);
	}

	getUrl() {
		return this.url;
	}
}