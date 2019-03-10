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
    this._render();
  }
  get template() {
    return data =>
      html`
        <style>
          :host {
            display: block;
            margin: 10px;
            background: #eee;
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
        </style>
        <div>
          <p class="text" .innerHTML=${al.link(data.Text)}></p>
          <span class="date">${data.Date}</span>
          <ul>
            ${this.media.map(
              m => html`
                <st-img src="${m.Url}"></st-img>
              `
            )}
          </ul>
          ${this.data.IsRetweet
            ? html`
                <span class="retweet">Retweet!</span>
              `
            : null}
          ${this.data.ReplyToId
            ? html`
                <a
                  href="https://twitter.com/FiredHuskers/status/${this.data
                    .ReplyToId}"
                  >Replied To</a
                >
              `
            : null}
          <p class="faves">${this.data.FaveCount} Faves</p>
        </div>
      `;
  }
  _render() {
    return render(this.template(this.data), this.shadowRoot);
  }
}

customElements.define('tweet-archive', TweetArchive);
