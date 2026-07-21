import {useMemo} from 'react';
import {
  data,
  redirect,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.preferences';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {CUSTOMER_PREFERENCES_MUTATION} from '~/graphql/customer-account/CustomerPreferencesMutation';
import {CUSTOMER_ID_QUERY} from '~/graphql/customer-account/CustomerIdQuery';
import {MUSIC_GENRES} from '~/lib/musicGenres';

interface MusicPreferences {
  genres: string[];
  artists: string[];
  updatedAt: string;
}

type ActionResponse = {error: string | null};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Deine Musik-Präferenzen'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();

  const form = await request.formData();
  const intent = form.get('intent');

  const genres = intent === 'skip' ? [] : form.getAll('genres').map(String);
  const artists =
    intent === 'skip'
      ? []
      : String(form.get('artists') ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 10);

  const {data: idData, errors: idErrors} = await customerAccount.query(
    CUSTOMER_ID_QUERY,
  );

  if (idErrors?.length || !idData?.customer?.id) {
    return data<ActionResponse>(
      {error: 'Konnte Kundenkonto nicht laden. Bitte versuch es erneut.'},
      {status: 400},
    );
  }

  const preferences: MusicPreferences = {
    genres,
    artists,
    updatedAt: new Date().toISOString(),
  };

  const {data: mutationData, errors} = await customerAccount.mutate(
    CUSTOMER_PREFERENCES_MUTATION,
    {
      variables: {
        customerId: idData.customer.id,
        value: JSON.stringify(preferences),
        language: customerAccount.i18n.language,
      },
    },
  );

  const userError = mutationData?.metafieldsSet?.userErrors?.[0];
  if (errors?.length || userError) {
    return data<ActionResponse>(
      {error: errors?.[0]?.message ?? userError?.message ?? 'Speichern fehlgeschlagen.'},
      {status: 400},
    );
  }

  return redirect('/account');
}

export default function AccountPreferences() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const {state} = useNavigation();
  const isSubmitting = state !== 'idle';

  const existing = useMemo<MusicPreferences | null>(() => {
    const raw = customer?.musicPreferences?.value;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as MusicPreferences;
    } catch {
      return null;
    }
  }, [customer?.musicPreferences?.value]);

  return (
    <div className="account-preferences">
      <h2>Was hörst du am liebsten?</h2>
      <p>
        Wähl ein paar Genres, die dir gefallen, und optional deine
        Lieblingskünstler — wir zeigen dir dann passendere Empfehlungen. Du
        kannst das jederzeit hier wieder ändern.
      </p>
      <Form method="POST">
        <fieldset className="preferences-genres">
          <legend>Genres</legend>
          <div className="preferences-genres__grid">
            {MUSIC_GENRES.map((genre) => (
              <label key={genre} className="preferences-genre-chip">
                <input
                  type="checkbox"
                  name="genres"
                  value={genre}
                  defaultChecked={existing?.genres?.includes(genre) ?? false}
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="artists">Lieblingskünstler (durch Komma getrennt)</label>
        <input
          id="artists"
          name="artists"
          type="text"
          placeholder="z. B. Flume, Metro Boomin, Bonobo"
          defaultValue={existing?.artists?.join(', ') ?? ''}
        />
        {actionData?.error ? (
          <p>
            <mark>
              <small>{actionData.error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <div className="preferences-actions">
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Speichert…' : 'Speichern'}
          </button>
          <button
            type="submit"
            name="intent"
            value="skip"
            formNoValidate
            className="preferences-skip"
            disabled={isSubmitting}
          >
            Später
          </button>
        </div>
      </Form>
    </div>
  );
}
