import { html, render } from 'https://unpkg.com/lit-html?module';
import { Autolinker } from 'https://unpkg.com/autolinker?module';

const al = new Autolinker({
  truncate: 30,
  mention: 'twitter',
  hashtag: 'twitter'
});
class TweetArchive extends HTMLElement {
  connectedCallback() {
    const data = JSON.parse(this.getAttribute('data'));
    this.attachShadow({ mode: 'open' });
    this.data = data;
    this.media = data.Media || [];
    this.id = this.data.Id;
    this._render();
  }
  get template() {
    return data =>
      html`
        <style>
          :host {
            display: block;
            max-width: 700px;
            margin: 10px auto;
          }
          .tweet {
            margin: 0 20px;
            background: #eee;
            position: relative;
          }
          .text {
            font-size: 2em;
          }
          .retweet {
            color: blue;
          }
          .faves {
            color: #333;
          }
          .permalink {
            position: absolute;
            top: 0;
            font-size: 2em;
            left: -20px;
            visibility: hidden;
          }
          :host(:hover) .permalink {
            visibility: visible;
          }
        </style>
        <div class="tweet">
          <a class="permalink" href="#${this.data.Id}">#</a>
          <p class="text" .innerHTML=${al.link(data.Text)}></p>
          <span class="date" title="${data.Date}">${data.dateAsStr}</span>
          <ul>
            ${this.media.map(
              m => html`
                <st-img src="${m.Url}"></st-img>
              `
            )}
          </ul>
          <div class="stats">
            ${this.data.RetweetCount > 0
              ? html`
                  <span class="retweet-count"
                    >${this.data.RetweetCount} RTs</span
                  >
                `
              : null}
            ${this.data.FaveCount > 0
              ? html`
                  <span class="fave-count">${this.data.FaveCount} Faves</span>
                `
              : null}
          </div>
          ${this.data.ReplyToId
            ? html`
                <a
                  href="https://twitter.com/FiredHuskers/status/${this.data
                    .ReplyToId}"
                  >Replied To</a
                >
              `
            : null}
        </div>
      `;
  }
  _render() {
    return render(this.template(this.data), this.shadowRoot);
  }
}

customElements.define('tweet-archive', TweetArchive);
