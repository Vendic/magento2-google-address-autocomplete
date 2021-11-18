<?php
declare(strict_types=1);

namespace Vendic\GoogleAutocomplete\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Vendic\GoogleAutocomplete\Model\Config\Settings;

class GoogleAutocompleteConfigProvider implements ConfigProviderInterface
{
    /**
     * @var Settings
     */
    private $settings;

    /**
     * @param Settings $settings
     */
    public function __construct(
        Settings $settings
    ) {

        $this->settings = $settings;
    }

    /**
     * @return string[][]
     */
    public function getConfig(): array
    {
        $config['vendic_google_autocomplete'] = [
            'api_key' => $this->settings->getApiKey()
        ];

        return $config;
    }
}
